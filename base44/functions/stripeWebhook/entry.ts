import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@16.12.0';

const cryptoProvider = Stripe.createSubtleCryptoProvider();

function validUntil(plan: string): string {
  const d = new Date();
  if (plan === 'cpl_monthly') d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const secret = Deno.env.get('STRIPE_SECRET_KEY');
    const whsec = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!secret || !whsec) return Response.json({ error: 'not configured' }, { status: 500 });
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });

    const sig = req.headers.get('stripe-signature');
    const bodyText = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(bodyText, sig, whsec, undefined, cryptoProvider);
    } catch (err) {
      return Response.json({ error: `signature: ${err.message}` }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const planKey = session.metadata?.plan || 'cpl_annual';
      const pilotId = session.metadata?.pilot_id || session.client_reference_id;

      const prs = await sr.entities.PaymentRequest.filter({ stripe_session_id: session.id });
      const pr = prs[0];
      if (pr && pr.status !== 'paid') {
        await sr.entities.PaymentRequest.update(pr.id, {
          status: 'paid',
          stripe_subscription_id: session.subscription || undefined,
        });
      }
      if (pilotId) {
        await sr.entities.Pilot.update(pilotId, {
          plan: 'cpl',
          plan_source: 'stripe',
          plan_valid_until: validUntil(planKey),
          stripe_customer_id: session.customer || undefined,
          stripe_subscription_id: session.subscription || undefined,
        });
      }
    } else if (event.type === 'invoice.paid') {
      // Subscription renewal — extend the validity window.
      const invoice = event.data.object;
      const subId = invoice.subscription;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        const planKey = sub.metadata?.plan || 'cpl_annual';
        const pilotId = sub.metadata?.pilot_id;
        let pilot = null;
        if (pilotId) { try { const p = await sr.entities.Pilot.filter({ id: pilotId }); pilot = p[0]; } catch { /* fall through */ } }
        if (!pilot) { const ps = await sr.entities.Pilot.filter({ stripe_subscription_id: subId }); pilot = ps[0]; }
        if (pilot) {
          await sr.entities.Pilot.update(pilot.id, {
            plan: 'cpl', plan_source: 'stripe', plan_valid_until: validUntil(planKey),
          });
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const ps = await sr.entities.Pilot.filter({ stripe_subscription_id: sub.id });
      const pilot = ps[0];
      if (pilot) await sr.entities.Pilot.update(pilot.id, { plan: 'free' });
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

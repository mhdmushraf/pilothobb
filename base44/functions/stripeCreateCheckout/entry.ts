import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@16.12.0';

// USD amounts in cents (Stripe minor units). zarRef is the "≈ R…" reference price.
const PLANS = {
  cpl_annual: { amountCents: 2700, interval: 'year', zarRef: 499, label: 'PilotHobb CPL — Annual' },
  cpl_monthly: { amountCents: 320, interval: 'month', zarRef: 59, label: 'PilotHobb CPL — Monthly' },
};

const genRef = () =>
  'PH-' + Array.from({ length: 6 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secret) return Response.json({ error: 'Payments are not configured.' }, { status: 500 });
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });

    const body = await req.json().catch(() => ({}));
    const planKey = body.plan === 'cpl_monthly' ? 'cpl_monthly' : 'cpl_annual';
    const plan = PLANS[planKey];

    const pilots = await base44.entities.Pilot.filter({ created_by_id: user.id }, '-created_date', 1);
    const pilot = pilots[0];

    const appUrl = Deno.env.get('APP_URL') || req.headers.get('origin') || 'https://pilothobb.com';

    // Reuse an existing Stripe customer for this pilot, or create one.
    let customerId = pilot?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name || pilot?.full_name || undefined,
        metadata: { pilot_id: pilot?.id || '' },
      });
      customerId = customer.id;
      if (pilot?.id) { try { await base44.entities.Pilot.update(pilot.id, { stripe_customer_id: customerId }); } catch { /* best-effort */ } }
    }

    const reference = genRef();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: { name: plan.label },
          unit_amount: plan.amountCents,
          recurring: { interval: plan.interval },
        },
      }],
      success_url: `${appUrl}/upgrade?stripe=return`,
      cancel_url: `${appUrl}/upgrade?stripe=cancel`,
      client_reference_id: pilot?.id || undefined,
      // Require a card up front, but don't charge during the 5-day free trial.
      payment_method_collection: 'always',
      metadata: { pilot_id: pilot?.id || '', plan: planKey, reference },
      subscription_data: {
        trial_period_days: 5,
        metadata: { pilot_id: pilot?.id || '', plan: planKey },
      },
      allow_promotion_codes: true,
    });

    await base44.entities.PaymentRequest.create({
      pilot_id: pilot?.id || '',
      plan: planKey,
      amount_zar: plan.zarRef,
      method: 'stripe',
      reference,
      status: 'pending',
      stripe_session_id: session.id,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

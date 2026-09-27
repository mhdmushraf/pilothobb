import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import Stripe from 'npm:stripe@16.12.0';

// Cancels the signed-in pilot's subscription at the end of the current period
// (or stops the trial from renewing). They keep access until then.
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secret) return Response.json({ error: 'Payments are not configured.' }, { status: 500 });
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20', httpClient: Stripe.createFetchHttpClient() });

    const pilots = await base44.entities.Pilot.filter({ created_by_id: user.id }, '-created_date', 1);
    const pilot = pilots[0];
    if (!pilot?.stripe_subscription_id) {
      return Response.json({ error: 'No active subscription to cancel.' }, { status: 400 });
    }

    const sub = await stripe.subscriptions.update(pilot.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    const endsAt = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString().split('T')[0]
      : (pilot.plan_valid_until || null);

    await base44.entities.Pilot.update(pilot.id, { subscription_status: 'canceling' });

    return Response.json({ ok: true, ends_at: endsAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Tap does not support ZAR, so we charge in USD. `amount` is in USD major units
// (e.g. 27.00). `zarRef` is stored only as the reference price shown to the
// customer ("≈ R499"). Confirm the amount with a Tap test charge before going live.
const PLANS = {
  cpl_annual: { amount: 27, zarRef: 499 },
  cpl_monthly: { amount: 3.2, zarRef: 59 },
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

    const secret = Deno.env.get('TAP_SECRET_KEY');
    if (!secret) return Response.json({ error: 'Payments are not configured.' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const planKey = body.plan === 'cpl_monthly' ? 'cpl_monthly' : 'cpl_annual';
    const plan = PLANS[planKey];

    const pilots = await base44.entities.Pilot.filter({ created_by_id: user.id }, '-created_date', 1);
    const pilot = pilots[0];

    const selfUrl = new URL(req.url);
    const webhookUrl = selfUrl.origin + selfUrl.pathname.replace(/tapCreateCharge\/?$/, 'tapWebhook');
    const appUrl = Deno.env.get('APP_URL') || req.headers.get('origin') || 'https://pilothobb.com';
    const firstName = (user.full_name || pilot?.full_name || 'Pilot').split(' ')[0];

    const charge = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: plan.amount,
        currency: 'USD',
        customer: { first_name: firstName, email: user.email },
        source: { id: 'src_all' },
        redirect: { url: `${appUrl}/upgrade?tap=return` },
        post: { url: webhookUrl },
        metadata: { pilot_id: pilot?.id || '', plan: planKey },
      }),
    }).then((r) => r.json());

    if (!charge || !charge.id || !charge.transaction?.url) {
      const msg = charge?.errors?.[0]?.description || 'Could not start the payment.';
      return Response.json({ error: msg }, { status: 502 });
    }

    await base44.entities.PaymentRequest.create({
      pilot_id: pilot?.id || '',
      plan: planKey,
      amount_zar: plan.zarRef,
      method: 'tap',
      reference: genRef(),
      status: 'pending',
      tap_charge_id: charge.id,
    });

    return Response.json({ url: charge.transaction.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

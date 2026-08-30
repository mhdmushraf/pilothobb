import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

async function hmacHex(key: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Renewal date: annual = +1 year, monthly = +1 month, from today.
function validUntil(plan: string): string {
  const d = new Date();
  if (plan === 'cpl_monthly') d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const secret = Deno.env.get('TAP_SECRET_KEY');
    if (!secret) return Response.json({ error: 'not configured' }, { status: 500 });

    const charge = await req.json();

    // Verify Tap's hashstring header (HMAC-SHA256 of the canonical field string).
    const provided = req.headers.get('hashstring') || '';
    const amountStr = typeof charge.amount === 'number' ? charge.amount.toFixed(2) : String(charge.amount ?? '');
    const toHash =
      'x_id' + (charge.id ?? '') +
      'x_amount' + amountStr +
      'x_currency' + (charge.currency ?? '') +
      'x_gateway_reference' + (charge.reference?.gateway ?? '') +
      'x_payment_reference' + (charge.reference?.payment ?? '') +
      'x_status' + (charge.status ?? '') +
      'x_created' + (charge.transaction?.created ?? '');
    const expected = await hmacHex(secret, toHash);
    if (!provided || provided.toLowerCase() !== expected.toLowerCase()) {
      return Response.json({ error: 'invalid signature' }, { status: 401 });
    }

    if (charge.status !== 'CAPTURED') {
      return Response.json({ ok: true, ignored: charge.status });
    }

    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;

    const prs = await sr.entities.PaymentRequest.filter({ tap_charge_id: charge.id });
    const pr = prs[0];
    if (!pr) return Response.json({ ok: true, note: 'no matching request' });
    if (pr.status === 'paid') return Response.json({ ok: true, note: 'already processed' }); // ignore duplicates

    await sr.entities.PaymentRequest.update(pr.id, { status: 'paid' });

    const pilotId = pr.pilot_id || charge.metadata?.pilot_id;
    if (pilotId) {
      await sr.entities.Pilot.update(pilotId, {
        plan: 'cpl',
        plan_source: 'tap',
        plan_valid_until: validUntil(pr.plan),
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

function plusYear(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

// Admin-only: mark a PaymentRequest paid (activates the plan) or rejected,
// then notify the pilot (in-app Notification + best-effort email).
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { id, action, admin_note } = await req.json();
    if (!id || !['paid', 'reject'].includes(action)) {
      return Response.json({ error: 'Bad request' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const found = await sr.entities.PaymentRequest.filter({ id });
    const pr = found[0];
    if (!pr) return Response.json({ error: 'Not found' }, { status: 404 });

    if (action === 'paid') {
      await sr.entities.PaymentRequest.update(id, { status: 'paid', admin_note: admin_note || undefined });
      const targetPlan = pr.plan === 'school' ? 'school' : 'cpl';
      const source = pr.plan === 'school' ? 'admin' : 'bank_transfer';
      if (pr.pilot_id) {
        await sr.entities.Pilot.update(pr.pilot_id, {
          plan: targetPlan,
          plan_source: source,
          plan_valid_until: plusYear(),
        });
      }
    } else {
      await sr.entities.PaymentRequest.update(id, { status: 'rejected', admin_note: admin_note || undefined });
    }

    // Notify the pilot.
    const title = action === 'paid' ? 'Your PilotHobb plan is active' : 'Payment could not be verified';
    const bodyText = action === 'paid'
      ? `Payment ${pr.reference || ''} confirmed. Your plan is now active — thank you.`
      : `We couldn't verify payment ${pr.reference || ''}.${admin_note ? ' Note: ' + admin_note : ' Please contact support.'}`;

    if (pr.created_by_id) {
      try {
        await sr.entities.Notification.create({
          user_id: pr.created_by_id, title, body: bodyText, type: 'payment', read: false,
        });
      } catch { /* in-app notification is best-effort */ }
      try {
        const users = await sr.entities.User.filter({ id: pr.created_by_id });
        const email = users[0]?.email;
        if (email) await sr.integrations.Core.SendEmail({ to: email, subject: title, body: bodyText });
      } catch { /* email is best-effort */ }
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

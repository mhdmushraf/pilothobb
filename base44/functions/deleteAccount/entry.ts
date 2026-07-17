import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const sr = base44.asServiceRole;
    const uid = user.id;

    // Remove all user-owned records (service role bypasses RLS)
    const entities = ['Pilot', 'Flight', 'Aircraft', 'AircraftDocument', 'Licence', 'Exam', 'Endorsement', 'ContactMessage'];
    for (const name of entities) {
      try { await sr.entities[name].deleteMany({ created_by_id: uid }); } catch { /* best-effort */ }
    }

    // Finally remove the user account itself
    await sr.entities.User.delete(uid);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
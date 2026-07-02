import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.json();
    const name = (body.name || '').toString().trim().slice(0, 100);
    const email = (body.email || '').toString().trim().slice(0, 200);
    const message = (body.message || '').toString().trim().slice(0, 5000);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please provide a valid name, email, and message.' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    await base44.asServiceRole.entities.ContactMessage.create({
      name,
      email,
      message,
      status: 'new',
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
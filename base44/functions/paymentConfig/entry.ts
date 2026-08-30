import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Returns bank-transfer deposit details + Tap public key for the Upgrade page.
// Reads server env so keys/details are never bundled into the client.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    return Response.json({
      bank: {
        accountName: Deno.env.get('BANK_ACCOUNT_NAME') || '',
        iban: Deno.env.get('BANK_IBAN') || '',
        swift: Deno.env.get('BANK_SWIFT') || '',
        bankName: Deno.env.get('BANK_NAME') || '',
      },
      tapPublicKey: Deno.env.get('TAP_PUBLIC_KEY') || '',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

# Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

Any change pushed to the repo will also be reflected in the Base44 Builder.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Run Locally

Run the full local development environment from the project root:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Base44 project config includes a `serveCommand`, `base44 dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Base44 project this lives in `base44/config.jsonc`.

## Run Only The Frontend

If you only want to work on the frontend against the hosted Base44 backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use The Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

`VITE_BASE44_APP_ID` identifies the Base44 app.

`VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests. Point it at your deployed Base44 app URL when you want the local frontend to use the hosted backend.

When you use `base44 dev`, the command injects the local Base44 values for you, so `.env.local` is mainly needed for frontend-only workflows.

## Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Backend function environment variables

Card payments run through **Stripe** (subscription Checkout). Set these in the
Base44 dashboard → backend function secrets. Never hardcode keys in the repo.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `stripeCreateCheckout`, `stripeWebhook` | Stripe secret API key (`sk_test_…` / `sk_live_…`). |
| `STRIPE_WEBHOOK_SECRET` | `stripeWebhook` | Signing secret (`whsec_…`) from the Stripe webhook endpoint you register. |
| `BANK_ACCOUNT_NAME` | `paymentConfig` | Bank-transfer account name shown on the Upgrade page. |
| `BANK_IBAN` | `paymentConfig` | Bank-transfer IBAN. |
| `BANK_SWIFT` | `paymentConfig` | Bank-transfer SWIFT/BIC. |
| `BANK_NAME` | `paymentConfig` | Bank name. |
| `APP_URL` | `stripeCreateCheckout` (optional) | Base app URL for the Stripe success/cancel redirect (defaults to the request origin, then `https://pilothobb.com`). |

**Stripe setup:** create the account, then in Stripe → Developers → Webhooks add an
endpoint pointing at the deployed `stripeWebhook` function URL, subscribed to
`checkout.session.completed`, `invoice.paid`, and `customer.subscription.deleted`.
Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`. Prices are
created inline by `stripeCreateCheckout` (USD $27/yr, $3.20/mo) — no dashboard
products needed. The old `tap*` functions are unused and can be ignored.

## Docs & Support

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)

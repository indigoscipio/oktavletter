# Algernon

Private letters to your future self.

## Run Locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The root landing page builds to `dist/index.html`. The app builds to `dist/app/`.

## Optional Email Delivery Backend

Algernon can run local-only, or with optional encrypted email delivery.

Backend pieces:

- Cloudflare Worker for the API
- Cloudflare D1 for encrypted letter storage
- Cloudflare Cron Trigger for daily reminder checks
- Resend for reminder emails

Create the D1 database:

```sh
npx wrangler d1 create algernon
```

Copy the generated `database_id` into `wrangler.toml`, then run the schema:

```sh
npm run db:migrate:remote
```

Set the Resend API key:

```sh
npx wrangler secret put RESEND_API_KEY
```

Deploy the Worker:

```sh
npm run worker:deploy
```

Use the Worker URL in local development:

```txt
VITE_API_BASE=https://algernon-api.samueloctavianus97.workers.dev
```

For Cloudflare Pages production, set the same `VITE_API_BASE` environment variable before building.

The backend stores encrypted letter data only. The unlock phrase is never sent to the server.

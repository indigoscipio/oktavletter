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

## Email Delivery Backend

Algernon uses a small Cloudflare backend for encrypted email delivery.

Backend pieces:

- Cloudflare Worker for the API
- Cloudflare D1 for encrypted letter storage
- Cloudflare Cron Trigger for daily reminder checks
- Resend for reminder emails

Set `VITE_API_BASE` to your deployed Worker URL:

```txt
VITE_API_BASE=https://your-worker.workers.dev
```

Useful backend commands:

```sh
npx wrangler d1 create algernon
npm run db:migrate:remote
npx wrangler secret put RESEND_API_KEY
npm run worker:deploy
```

The backend stores encrypted letter data only. The unlock phrase is never sent to the server.

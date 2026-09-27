# Togetherly

A responsive, deployment-ready demo for a couples expense dashboard. It uses realistic mock data for Lena and Noah, presenting each partner's spend around a shared financial centre.

## What is included

- Two-partner monthly balance with animated money-connection paths
- Shared spending trend and category breakdown
- Recent transactions using dummy data
- Responsive navigation and mobile layout
- Receipt import modal that simulates the later OpenAI extraction flow

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

Push this repository to GitHub, then import it at [vercel.com/new](https://vercel.com/new). Vercel automatically detects Next.js; no configuration or environment variables are needed for this demo.

## Real-data phase

The next implementation phase should add authenticated couples, a receipt upload endpoint, OpenAI structured extraction, and Neon persistence. A clean data model would include `couples`, `members`, `receipts`, and `transactions`, with each transaction assigned to `lena`, `noah`, or `shared`.

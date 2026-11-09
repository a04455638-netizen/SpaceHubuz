# SpaceHub UZ — Environment & Provider Configuration Guide

This guide describes how to configure environment variables for local development, staging, and production.
Never commit `.env` or `.env.local` to git or expose secrets to client bundles.

---

## 1. Supabase Configuration (Database, Auth, Storage, Realtime)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings > API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon` / `public` key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Copy `service_role` key → `SUPABASE_SECRET_KEY` (Server-only! Never leak in client components)
3. Go to **Project Settings > Database**:
   - Connection Pooling string (Transaction mode, port 6543) → `DATABASE_URL`
   - Direct connection string (Session mode, port 5432) → `DIRECT_URL`
4. Enable `btree_gist` extension in Supabase SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS btree_gist;
   ```
5. Create a public Storage bucket named `spacehub-media` for approved venue media, and a private bucket `spacehub-private` for user documents.

---

## 2. OpenAI Configuration (AI Concierge & Responses API)

1. Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Set `OPENAI_API_KEY="sk-..."` in `.env.local`.
3. Configure model selection:
   - `OPENAI_MODEL="gpt-4o-mini"` (fast, accurate, cost-effective for conversational search)
   - `OPENAI_IMAGE_MODEL="dall-e-3"` (for demo visuals and marketing asset generation)
4. Budget and safety controls:
   - `OPENAI_MAX_REQUESTS_PER_USER_PER_DAY="50"`
   - `OPENAI_MONTHLY_BUDGET_USD="50"`
5. If `OPENAI_API_KEY` is not provided, the application automatically uses deterministic fallback search against verified database listings and catalog categories.

---

## 3. SMS & OTP Verification (+998 Uzbekistan)

1. For local development and CI testing:
   - Set `OTP_PROVIDER="simulator"`
   - The test simulator accepts fixed verification code in development (`123456`) or logs OTP securely in test runners.
2. For production with Eskiz.uz:
   - Set `OTP_PROVIDER="eskiz"`
   - Set `ESKIZ_EMAIL="your-email@example.com"`
   - Set `ESKIZ_PASSWORD="your-eskiz-password"`
   - Set `ESKIZ_FROM="SpaceHub"` (registered sender ID)

---

## 4. Payment Gateways (Click & Payme)

### Click Merchant Integration

- `CLICK_SERVICE_ID=""` (From Click Merchant cabinet)
- `CLICK_MERCHANT_ID=""`
- `CLICK_SECRET_KEY=""`
- `CLICK_MERCHANT_USER_ID=""`

### Payme (Paycom) Integration

- `PAYME_MERCHANT_ID=""` (From Paycom Business cabinet)
- `PAYME_SECRET_KEY=""`
- `PAYME_TEST_MODE="true"` (Set to `"false"` in production)

---

## 5. Telegram Operational Bot

1. Create a bot using [@BotFather](https://t.me/BotFather) on Telegram and copy the API token.
2. Set `TELEGRAM_BOT_TOKEN="123456789:ABC..."`
3. Set `TELEGRAM_OWNER_CHAT_ID=""` (Chat ID for admin/owner alerts)
4. Set `TELEGRAM_WEBHOOK_SECRET=""` (Secret token for incoming webhook verification)

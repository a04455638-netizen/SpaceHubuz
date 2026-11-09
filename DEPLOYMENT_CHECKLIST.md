# SpaceHub UZ — Production Preflight & Deployment Checklist

Before going live on Vercel or any cloud environment, verify every checkpoint below:

---

## 1. Database & Security (Supabase PostgreSQL)

- [ ] PostgreSQL 16+ instance provisioned with `DATABASE_URL` and `DIRECT_URL`.
- [ ] `btree_gist` extension enabled for interval exclusion constraints.
- [ ] All Prisma migrations applied: `npm run db:migrate`.
- [ ] Row Level Security (RLS) enabled on all exposed tables:
  - Public can SELECT only published venues and active resources.
  - Customers can access only their own profiles, bookings, and favorites.
  - Owners can access only their venues, resources, blocks, and reservations.
  - Admins require validated server-side role assignment.
- [ ] `SUPABASE_SECRET_KEY` is kept server-only and NEVER exposed in `NEXT_PUBLIC_*` or client bundles.

## 2. Authentication & Identity

- [ ] Supabase Auth SSR configured with secure HttpOnly cookies.
- [ ] +998 Uzbekistan phone format validation enforced on server and client.
- [ ] SMS provider active with verified sender ID (Eskiz.uz) in production; simulator disabled in production (`NODE_ENV=production`).
- [ ] Rate limits configured for OTP requests (max 3 requests per 10 minutes per IP/phone).

## 3. Booking Engine & Concurrency

- [ ] Database GiST exclusion constraint (`Occupancy_no_overlap`) verified against concurrent overlapping bookings.
- [ ] Hold expiration scheduled job configured to release uncompleted bookings after 15 minutes.
- [ ] Atomic booking transactions verified: hold → payment → confirm.
- [ ] Real-time availability updates propagate to customer calendars without leaking customer PII.

## 4. Payments (Click & Payme)

- [ ] Official Click Merchant agreement and credentials verified.
- [ ] Official Payme Business agreement and credentials verified.
- [ ] Webhook signature verification and idempotency keys enforced on `/api/payments/webhook/*`.
- [ ] Integer minor units (or exact decimals) used for all UZS calculations.

## 5. OpenAI AI Concierge

- [ ] `OPENAI_API_KEY` configured in server environment.
- [ ] Read-only tool functions bounded and validated on server.
- [ ] Prompt injection defense and token limits verified.
- [ ] Daily per-user request limits and monthly budget limits active.
- [ ] Graceful fallback to catalog keyword search active when API is unreachable.

## 6. Visual Assets & Media

- [ ] Scalable SVG brandmark and logo deployed.
- [ ] Verified venue photography policy enforced: demo illustrations explicitly labeled; no fabricated photos passed off as real venues.
- [ ] Asset audit passed: all card images resolve without broken 404s.

## 7. QA, Responsive UX & Performance

- [ ] 37+ routes resolve without 404 or uncaught exceptions.
- [ ] Tested on 360px mobile, tablet, and desktop viewports.
- [ ] Dark and light theme toggle functional and persisted across reloads.
- [ ] Trilingual UI (Uzbek default, Russian, English) verified across navigation, catalog, and booking.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npm test` passes all test suites.
- [ ] `npm run build` succeeds cleanly.

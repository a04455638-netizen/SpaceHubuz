# SPACEHUB UZ — ULTIMATE PRODUCTION MASTER PROMPT (SUPABASE + OPENAI + ORIGINAL ASSETS)

> ONE CONSOLIDATED MASTER PROMPT. This file supersedes the earlier SpaceHub prompts. Place it in the existing `spacehub uz` project folder, and instruct Antigravity to read it fully and implement the upgrade in safe, verified phases. Never start an unrelated repository.
> Language: English for implementation accuracy. Product interface: Uzbek (default), Russian and English.

## 0. YOUR MISSION AND WORKING RULES

Act as a coordinated team of senior full-stack engineers, a solution architect, UX/UI designers, database and security engineers, QA specialists, and DevOps engineers. Build **SpaceHub UZ**, a premium, production-oriented, multi-category venue discovery and booking marketplace for Uzbekistan.

This is a real product, not a static mockup, marketing-only landing page, or disconnected admin dashboard. Deliver a connected customer website, property-owner portal, administrator console, secure backend, persistent database, payment integration architecture, messaging and operational tools. All prominent buttons, navigation items and forms must work. Never return a fake success state for a failed or nonexistent backend action.

**Do the work in the ten phases below.** At the end of each phase: implement the code, run checks, write a concise completion report with actual test results, list any blockers and resolve those within the repository before proceeding. Do not claim tested, deployed or integrated if it is not. If API keys, payment merchant accounts, phone/SMS credentials or third-party approvals are unavailable, implement secure provider abstractions and fully working sandbox/test paths, clearly flag the real integration as not activated, and document exact environment variables and setup steps. Do NOT fabricate keys, payment confirmations, venue inventory, reviews, user accounts, live prices or production status.

The existing SpaceHub UZ repository MUST be inspected and preserved. Before destructive changes, create a Git checkpoint and a verified recovery plan; do not reset, overwrite, drop tables, delete assets, or lose real records. Use TypeScript, clean modular architecture, type-safety, semantic HTML, accessibility and maintainable testing. No placeholder buttons and no unnecessary feature bloat. Every extra capability must genuinely improve finding, booking, using or managing a place.

## 1. BUSINESS DEFINITION AND USER ROLES

A marketplace for locating and reserving:

1. Coworking places and quiet study rooms.
2. Sports halls and facilities: football/futsal fields, tennis/padel courts, gyms and multi-sport spaces.
3. Conference rooms, meeting rooms and training classrooms.
4. Event halls, workshops and celebration venues.

This is a **hybrid multi-owner marketplace**: independent verified venue owners can list their venues; authorized platform staff can create/manage platform-owned listings. Roles: GUEST, CUSTOMER, OWNER, OWNER_STAFF (scoped), SUPPORT_AGENT (scoped), ADMIN and SUPER_ADMIN. Enforce roles and object ownership in backend authorization, not only in frontend navigation.

The primary market is Uzbekistan. Default locale `uz`, secondary `ru` and `en`; display local prices in UZS, phone numbers in `+998` format and dates/times in `Asia/Tashkent` for Uzbekistan locations. Store timestamps consistently in UTC and honor each venue's IANA timezone. Make geography, currencies and localization extensible.

### External product benchmark inspiration (not code or design to copy)

Assess product patterns from at least these eleven examples while designing, but create original brand, UI and code:

- Peerspace: hourly event/meeting bookings and transparent booking policies.
- Giggster: detailed venue-specific filters and host communication.
- Tagvenue: event type, capacity and amenity discovery.
- LiquidSpace: flexible hourly/daily workspace booking.
- Deskpass: coworking amenities and flexible usage.
- WeWork On Demand: clear workspace cards and day/meeting usage.
- Skedda: resource booking rules, scheduling and owner controls.
- Playtomic: sports courts, group booking and participant workflows.
- Spacebase: meeting services, corporate requirements and add-ons.
- OpenSports: participant management and waitlists.
- EventUp: venue media, FAQs and multiple rooms.

These references are **inspiration**, not verified claims that any competitor lacks a feature. Differentiate by integrating all four categories, localized payments/UX, reliable anti-double-booking, accessible owner controls, transparent total costs and lasting customer accounts.

## 2. REQUIRED TECHNOLOGY AND ARCHITECTURE

- Frontend: latest compatible **Next.js App Router**, **TypeScript**, **Tailwind CSS**, reusable components and CSS variables/design tokens.
- Backend: Next.js server-side Route Handlers and server services for this single-product architecture; design clear service modules for eventual extraction to NestJS if scale requires. Do not place trusted business logic solely in client components.
- Primary managed backend: **Supabase** (hosted PostgreSQL, Auth, Storage, Realtime). Supabase is not optional for the upgraded production architecture unless a clear documented blocker exists.
- Data access: **Prisma ORM** for secure server-side queries and migration versioning when compatible; use SQL migrations for RLS, exclusion constraints, triggers and other PostgreSQL-specific capabilities. Avoid two conflicting schema/migration owners.
- Session/auth: **Supabase Auth** + maintained **@supabase/ssr** cookie-based Next.js integration, validated identity on server routes, secure cookie/session handling and CSRF protection where appropriate. Use Supabase Auth for users; do not duplicate identity credentials in a second auth system.
- OTP/SMS: Supabase phone OTP with a configured, supported SMS provider. Production needs actual provider activation; development simulator restricted to tests. Rate-limit, expire and bound OTP attempts. Never log OTP plaintext.
- Storage: **Supabase Storage**, public optimized listing-media bucket for approved listing images, private user uploads where appropriate, strict storage policies, signed URLs, MIME/size validation and safe file naming.
- Search: PostgreSQL text/geo indexing initially, with design allowing a dedicated search service later. Geolocation/map provider via configuration.
- Payments: server-side **Click and/or Payme** merchant provider adapters, initialized only with real approved credentials; webhook verification, idempotency, reconciliation and refunds. Manual/pay-on-arrival option if allowed by venue, explicitly reflected in booking status. Do not say payment is successful before trusted provider confirmation.
- AI: official maintained **OpenAI JavaScript SDK** with **Responses API** (not retired Assistants API) for a secure grounded AI concierge; optional official image-generation API for **original demonstration/marketing assets**, with configurable model, budgets and generated-media review.
- Observability: structured logs with secret/PII redaction, production error tracking, trace IDs, alerting and analytics that respect user privacy.
- Notifications: Telegram bot for owner/admin operational alerts, customer SMS/email/Telegram only after proper user opt-in and channel linking. Queue/retry delivery jobs, log delivery state.
- Real-time UI: SSE, WebSocket or push invalidation with fallback polling; database is always source of truth.
- Libraries: choose established, compatible and maintained tools; Framer Motion or equivalent for restrained animations, React Hook Form and schema validation as appropriate, a coherent icon library.
- Deployment: Vercel for Next.js plus managed PostgreSQL/storage/job infrastructure; choose a durable background-job mechanism supported by hosting (do not rely on in-memory timers or ephemeral serverless jobs).
- Testing: unit + integration + concurrency + Playwright E2E; formatting, lint, typecheck and CI checks.

Keep `.env.example`, setup instructions, Prisma migrations, seeding **development-only** sample data, and a clear production deployment checklist. Never put a DATABASE_URL, service-role key, SMS secret, payment secret or Telegram token in client bundles.

## 3. INFORMATION ARCHITECTURE — AT LEAST 26 MAIN PAGES

### Customer-facing public/private website (10 main pages)

1. `/` Home: strong search hero, real featured listings, categories, locations, how booking works, testimonials only when genuine, trust information.
2. `/explore` Discover places: filters, listing results, search and sorting.
3. `/venues/[slug]` Place details: real media, facilities, rules, availability, resource selector, reviews, full address and map.
4. `/map` Discovery map linked to search results.
5. `/booking/[resourceId]` Booking flow with date/time selection and booking validation.
6. `/checkout/[bookingId]` Final price, policies, payment, verified confirmation.
7. `/account/bookings` Upcoming, completed, pending and canceled bookings with a detailed booking view.
8. `/account/favorites` Saved venues.
9. `/account/profile` Rich customer profile and preferences.
10. `/support` FAQ, ticket creation and ticket progress.

Additional essential routes: sign in/register/OTP, account security, booking confirmation, notifications, detailed booking receipt, review form, legal/privacy pages and localized not-found/error states.

### Venue owner portal (7 main pages)

1. Owner dashboard with actionable KPIs.
2. My venues: multiple branches, facilities and individual bookable resources.
3. Add/Edit venue with staged form, media upload and moderation state.
4. Availability calendar with operating hours, maintenance blocks and buffers.
5. Reservations with details, approval rules, cancellation and check-in.
6. Earnings with gross/net amounts, applicable commission and payouts status.
7. Owner settings: personnel, notification rules, refund and house policies.

### Admin console (9 main pages)

1. Platform overview dashboard.
2. Users/roles and identity status.
3. Listing moderation and venue management.
4. All bookings and booking investigations.
5. Payments, commissions, refunds and reconciliation.
6. Analytics, utilization, revenue and funnel reporting.
7. Discounts, campaigns and promo codes.
8. Support, abuse reports and disputes.
9. System settings, role permissions and audit log access.

Admin console has its own protected layout and login requirements. **Never place a public Admin Panel access button in the site footer** or otherwise advertise the privileged route. Visible navigation must reflect user roles; server authorization is mandatory even for directly opened URLs.

## 4. THIRTY MANDATORY PRACTICAL FEATURES

Implement all thirty; prioritize booking reliability over superficial visual effects.

1.  Live, server-authoritative availability when selecting date/time.
2.  Search by place name, district, category and service.
3.  Interactive map and location/distance presentation.
4.  Filters for capacity, price, amenities, review score, time and duration.
5.  Visual availability calendar by _bookable resource_, not only by venue.
6.  Database-enforced prevention of double booking/overlapping intervals.
7.  Real payment provider architecture with verified callbacks.
8.  Booking cancellation according to explicit venue policies.
9.  Refund requests, approval state and payment reconciliation.
10. Permanent customer account and cross-device booking history.
11. Venue owner dashboard with booking operations.
12. Moderated venue submission and verification workflow.
13. Correct photo/video gallery tied to each actual venue.
14. Verified post-stay/post-use reviews and ratings.
15. Customer favorites list.
16. Accurate duration/add-ons/fees price calculation in UZS.
17. Unique QR reservation check-in and auditable scan handling.
18. Reliable owner/customer notification delivery status.
19. Booking reminders before the reserved slot.
20. Uzbek/Russian/English translation across all UI and errors.
21. Accessible responsive design with functional dark/light themes.
22. Fast mobile experience, including small-screen navigation.
23. Promotions, eligibility rules and promo code validation.
24. Waitlist for unavailable slots with opt-in notices.
25. Recurring weekly/monthly reservations with conflict checks.
26. Multi-branch and multiple-resource management per owner.
27. Owner earnings, occupancy and reservation analytics.
28. Admin platform analytics and reporting.
29. Strong permissions, fraud protection and audit logs.
30. Support ticket/dispute workflow for customers and owners.

## 5. CUSTOMER EXPERIENCE — NONNEGOTIABLE DETAILS

### Registration and identity

Visitors may browse anonymously. Before the first confirmed booking, prompt the customer for first name, optional last name and phone number (Uzbekistan +998 format). Verify via SMS OTP. Request optional profile image only as an optional follow-up; do not block booking if skipped. Allow email as an optional recovery/notification channel. Do not invent OTPs or enable insecure permanent development bypass in production.

Returning customers must be able to sign in from other devices using their verified identity; they must see the same profile and booking history. Keep them signed in during the valid session, provide explicit logout and session revocation; do not require registration after every browser restart if valid secure session remains.

### Rich customer profile

Provide real editable profile photo (validated size/type, sanitized filenames), first/last name, verified phone, optional email, preferred language, light/dark mode, optional default location, notification preferences, upcoming and previous bookings, paid receipts, favorite places, recently viewed places (with suitable privacy handling), approved reviews, cancellation/refund status, support tickets, security/sessions and account deletion/export options. Profile completeness may be shown without coercive nagging. Provide useful empty/loading/error states and accessible forms.

### Critical booking visibility

When **customer A** successfully reserves a resource between `10:00–11:00`, every other customer viewing that same resource/date must see **10:00–11:00 as BOOKED / unavailable**, without seeing customer A's personal identity. Show the remaining free intervals distinctly. When a booking is released or canceled per rules, availability must update. Display the place's full address, map, exact date, start/end time and local timezone, price and conditions alongside the calendar.

Customer A must see the booking in **My Bookings** after reloading, closing and reopening the site, logging out and back in, or logging in from a different device. The reservation is stored in PostgreSQL, never only localStorage or a browser state variable. Ownership and authorization on `GET booking by ID` must be validated on the server.

### Example calendar (illustration only)

Venue: Futsal Court A; sample address: Chilonzor, Tashkent (not a real listing).

- 09:00–10:00 Available
- 10:00–11:00 Booked
- 11:00–12:00 Available
- 12:00–13:00 Booked
- 13:00–14:00 Available
  If a customer clicks a booked slot, disable the button, explain it is unavailable and suggest nearby alternatives.

### Booking detail card

Show actual venue photo and name, resource name, full address, map directions link, date, timezone, start/end, length, subtotal/fees/total, paid/unpaid/refunded state, booking state, unique reference, QR check-in when applicable, cancellation and refund rules, owner/platform support contact path, and status timeline. Do not reveal private customer details to other users.

## 6. RELIABLE BOOKING ENGINE — DESIGN BEFORE IMPLEMENTING UI

Implement robust interval-based inventory because resources can have different durations and operating schedules. Design for distinct venue resources (e.g., two conference rooms in one building), timezone-specific operating hours, venue blocks/holidays, owner-imposed lead times, setup/cleanup buffers and maximum advance booking periods.

Booking state machine should cover at least: `DRAFT` (if stored), `HOLD` with expiry, `AWAITING_PAYMENT`, `REQUESTED` (where owner approval is needed), `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `NO_SHOW`, `REFUND_PENDING`, `REFUNDED` as applicable. Define valid transitions and exactly which states occupy inventory. Keep financial status distinct from reservation status where appropriate.

**Race-safe booking:** For resource/date/time intervals, enforce exclusion of overlapping _inventory-occupying_ reservations at the database level using a PostgreSQL exclusion constraint/range strategy or an equivalent proven transactional design. Prisma alone may not expose every PostgreSQL constraint; add reviewed SQL migrations where necessary. Revalidate availability in one atomic transaction. Make checkout and webhook processing idempotent. Handle two simultaneous requests so that only one gets a confirmed reservation. Never rely on button disabling, client-side state, cache invalidation or optimistic UI as the sole protection.

Temporary holds must expire via durable scheduled processing; expiration must release inventory. If payment completion arrives after hold expiry, do not blindly confirm a taken slot: reconcile/reject/refund according to documented rules. Protect against replayed webhooks and race conditions. Auditable cancellations and refund decisions are mandatory.

Real-time updates should communicate occupancy changes through SSE/WebSockets or reliable polling and cache invalidation; server availability always wins. On submission, present a meaningful conflict response and suggest the closest alternative time.

## 7. EXPANDED FEATURES FROM MARKETPLACE RESEARCH

In addition to the 30 mandatory features, include these practical differentiators, staged according to complexity:

- Side-by-side compare up to 3 venues with total price, capacity, location, equipment and availability.
- Clearly itemized **full price before pay**: base, service fees, extras, deposits, promotions and taxes if applicable.
- Two booking workflows: instant confirmation for supported resources and approval-request for owner-controlled venues.
- Alternative time/resource suggestion when a requested slot is blocked.
- Resource-specific amenity attributes (coworking: Wi-Fi, monitors, quiet area; sport: turf, lighting, locker room; meetings: projector, video calls; events: seating, catering).
- Separate availability for every room/court in a multi-resource venue.
- Venue verification badge backed by real admin review; clear venue rules and actual media.
- Digital reservation receipt and export to calendar (.ics).
- Optional event/participant invites; group booking with organizer and attendee limits.
- Split payments only after verifying that payment-provider capabilities make it reliable; otherwise record shares without pretending payment occurred.
- Add-ons (equipment, catering, cleaning) with inventory and transparent pricing.
- Corporate profiles, invoices and recurring monthly usage for business clients.
- Waitlists with explicit consent, deduplication and time-sensitive notifications.
- Refund status tracking and documented dispute resolution.
- Owner statistics showing occupancy by slot, cancellation rate and revenue.
- Owner-maintained blocked times for maintenance and holidays.
- Optional external calendar import/export with conflict handling.
- Optional venue FAQs and floor plans, only when data is available.
- Clear check-in instructions, navigation and support on the booking day.
- Helpful recommendation rules based on category, availability, location and actual preferences; do not require an expensive AI model or infer sensitive attributes.

Do not add speculative features that distract from booking stability. All listed features should have a clear path through real data models, API endpoints and interface flows.

## 8. DATA MODEL AND API DESIGN

Design and migrate normalized tables/models, adjusting names as needed:

- User, UserIdentity, Session, Role, RoleAssignment, UserProfile.
- OwnerOrganization, OwnerMembership, Venue, VenueVerification, Branch.
- Resource, ResourceCategory, VenueAmenity, ResourceAmenity, VenueMedia.
- OpeningHours, AvailabilityRule, ResourceBlock, HolidayException.
- Booking, BookingHold, BookingParticipant, BookingStatusEvent, BookingCheckIn.
- PriceRule, AddOn, BookingAddOn, PromoCode, PromoRedemption.
- Payment, PaymentEvent, Refund, Payout, CommissionRule, Invoice.
- Review, Favorite, RecentlyViewed, WaitlistEntry.
- Notification, NotificationDelivery, SupportTicket, SupportMessage, AuditLog.
- Optional ExternalCalendarConnection, CalendarSyncEvent, CorporateAccount.

Include indexes on resource availability, interval boundaries, owner references, location, booking statuses, order of creation and frequently searched fields. Include cascading/soft-delete strategy, safe PII retention policies and deletion requirements. Monetary calculations use integer minor units or exact decimal types, never floating point in financial arithmetic.

Public APIs for search, venue detail, calendars, reviews and supported availability. Authenticated customer APIs for profile, booking creation and management, payments, favorites and tickets. Owner-scoped APIs for venues, media, rooms, pricing, blocks, approval and earnings. Privileged admin APIs for moderation, transactions, support and audit investigation. Validate all API inputs using runtime schemas; avoid mass assignment and horizontal privilege escalation. Add pagination, rate limits, structured errors and consistent status codes.

## 9. PAYMENTS, TELEGRAM, COMMUNICATIONS

Support Uzbekistan-centric checkout in UZS. Build real Click/Payme provider abstraction to connect official merchant credentials and approved callbacks. A front-end 'Pay' click is never proof of payment. Confirm provider status on the server; verify webhook signatures and transaction data; reconcile late/duplicate events. Store non-sensitive references and avoid handling raw payment-card information. Show offline/pay-at-venue only where permitted; communicate the reservation's exact status.

Telegram owner bot sends new booking, cancellation, schedule changes and relevant support alerts, but only after authorized account linking. Include venue, resource, date/time, booking reference and status; minimize customer PII. Support deep links or protected owner dashboard URLs. Never expose tokens in client components. Customer notification preferences must be respected. Send reminder jobs using reliable background scheduling and idempotent delivery processing.

## 10. PREMIUM VISUAL AND UX DIRECTION

Create an original elegant, Airbnb-like level of clarity without reproducing Airbnb or other competitors' branded layouts. Professional typography, consistent grid, deliberate whitespace, accessible colors, strong photography, readable price/location/availability components, subtle micro-animations and meaningful motion. Users must understand search → compare → date/time → review total → confirm/pay → view booking without confusion.

Build a responsive navigation that actually works on mobile, a complete footer without admin-only access shortcuts, skeleton/loading/error/empty screens, keyboard accessible controls, form validation feedback, accessible map fallback and reduced-motion support. Dark/light theme must be functional and persistent across sessions if preference is stored. Every listing image must correspond to its actual venue and resource; no misleading random images. Only show review scores derived from real reviews.

Performance: modern image optimizations, pagination/lazy loading, caching for public listing data with invalidation, Core Web Vitals discipline, meaningful page metadata, structured data if suitable, canonical routes and sitemap. Accessibility target WCAG 2.2 AA where practical.

## 11. ADMIN AND OWNER OPERATIONS

OWNER:

- Step-by-step new venue creation with saved drafts.
- Manage address, verified geolocation, categories, amenities, media, house rules, operating hours, per-room/court schedules, durations, prices, add-ons and deposits.
- View new, confirmed, completed and canceled reservations.
- Approve/reject `REQUESTED` reservations with explicit deadline and state transition.
- Manage staff with narrowly scoped permissions.
- View payment status, business analytics, utilization, payouts and support tickets.
- Block maintenance time and prevent existing-confirmed-booking conflicts.

ADMIN:

- Verify owners and moderate venue listings before public publication.
- See operational dashboards: booking conversion, total bookings, gross transaction volume, applicable marketplace fees, refunds, disputes, utilization and active owners.
- Search/filter users, owners, venues, bookings and transactions.
- Suspend dangerous or fraudulent listings with audit reasons and appropriate customer handling.
- Manage legitimate promo codes, content categories and basic CMS sections.
- Review disputes, refunds and tickets with traceable status/history.
- Enforce granular roles and audit every sensitive action.
- Protect personally identifiable information and avoid unnecessary disclosure to support staff.

No developer backdoor, no public super-admin registration, no hardcoded production admin password. Bootstrap admin only through documented secure operator procedure.

## 11A. SUPABASE-FIRST IMPLEMENTATION CONTRACT (CRITICAL)

### A. Authentication and secure identity

- Use the current maintained Supabase SSR setup for Next.js App Router (`@supabase/ssr`): browser and server clients, secure cookie refresh, SSR-safe access checks, and server-side validation of the current user.
- Guests can search and view public venues; login/registration is requested at booking. First name, last name (optional) and +998 phone number. Verify phone with real OTP provider when configured. Photo/email optional.
- A user may sign in again on another device and see the same profile, favorites, payment receipts and upcoming/past/cancelled bookings. Neither refresh, browser closure nor sign-out deletes bookings.
- Use trusted membership/role records and server-authorized admin provisioning; client-editable user metadata cannot authorize ADMIN/OWNER access. Include narrowly scoped owner staff permissions.
- Document SMTP/phone provider configuration separately; if the SMS provider is unavailable, explain how a local test simulator works and NEVER make its bypass available in production.

### B. Explicit environment variable contract

Use ONLY environment variable placeholders in committed templates; never demand real key values inside the prompt or chat. Document exact meanings and required permissions. Recommended `.env.example`:

```dotenv
# Safe public Supabase browser configuration (NOT secret credentials)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Server-only Supabase administrative/secret key; NEVER use in client bundle
SUPABASE_SECRET_KEY=
# Older projects may use SUPABASE_SERVICE_ROLE_KEY; if so, document it as legacy and server-only

# Prisma migrations / trusted server connection; treat both as secrets
DATABASE_URL=
DIRECT_URL=

# Server-only AI configuration
OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_IMAGE_MODEL=
OPENAI_MAX_REQUESTS_PER_USER_PER_DAY=
OPENAI_MONTHLY_BUDGET_USD=

# Optional integrations, only active after provider setup
SMS_PROVIDER=
SMS_PROVIDER_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_OWNER_CHAT_ID=
CLICK_MERCHANT_ID=
CLICK_SECRET_KEY=
PAYME_MERCHANT_ID=
PAYME_SECRET_KEY=
MAPS_PROVIDER_KEY=
CRON_JOB_SECRET=
APP_BASE_URL=
```

- Exact provider variable names may vary, but keep one documented canonical config schema validated on startup via Zod or equivalent.
- Public Supabase publishable key is intended for client use, but is NOT a substitute for RLS. Secret/admin keys, OpenAI key, connection strings, Telegram tokens and payment credentials are **server-only**.
- Use the secret/admin key only for approved narrowly scoped back-office operations; do not use it as a shortcut for all customer queries. Avoid leaking it in error output, logs, browser builds, screenshots or Git. `.env.local` is gitignored.
- Explain clearly how to find the Supabase Project URL, publishable key and server-only secret key in project settings, how to get the database connection string, and where the user must configure OpenAI API credentials, SMS and payment providers. Never assume any key is already configured.

### C. PostgreSQL schema, RLS, and migrations

- Model `profiles` linked 1:1 to `auth.users.id`; `roles` and owner memberships; `venues` and `venue_resources`; resource media; availability rules; closure periods; `booking_holds`; `bookings`; `booking_events`; `payments`; `refunds`; `reviews`; favorites; tickets; notification deliveries; generated asset provenance; and `audit_logs`. Align with the existing data model rather than blindly duplicate tables.
- Every **exposed** table must use carefully scoped RLS and appropriate grants. Public users may read only verified/published venue details and public availability; authenticated customers may access their own profiles and bookings; owners may access only records for venues they own/staff; admins must be authorized server-side. Private owner financial/customer data must never appear in public searches.
- Apply RLS + storage bucket policies in version-controlled migrations. Test `anon`, unrelated customer, correct customer, different owner, actual owner and admin cases, including SELECT/INSERT/UPDATE/DELETE denials. Do not create permissive `USING (true)` for private data.
- Add indexes for RLS and search patterns; paginate results. Test deletion and update attempts against other users' data. Carefully handle security-definer functions (safe search path, private schema, minimal grants) if actually necessary.
- Design a forward-only, reversible-where-possible migration process and documented production backup/restore procedure. Never run destructive `db push --force-reset` or drop a production schema. Migration history must be reviewable.

### D. Race-safe real-time booking contract

- Database is source of truth, NOT React state, localStorage, browser cache, WebSocket messages or AI output.
- Define resource-specific intervals with `[start_at, end_at)` semantics and UTC storage, venue timezone display. Distinguish venue and independently bookable resources such as separate rooms, courts and halls.
- Choose and implement a verified DB-level overlapping-slot prevention strategy: PostgreSQL GiST exclusion constraint / range type for inventory-occupying statuses or a proven equivalent transaction/locking design. Include SQL migrations if Prisma cannot define the constraint directly. Document and test the exact inventory occupancy rules.
- Booking states and payment states are separate. Handle temporary holds with server-set expiry and durable cleanup; late payments cannot steal a newly booked slot. Preserve booking history and audit trail.
- On every write, recheck authority, time boundaries, price version, cancellation rules and overlap inside a transaction. Make customer requests, payment webhooks and refund operations idempotent and enforce strict status transitions.
- Use Supabase Realtime for fast **display updates**, with appropriate access policies; poll or revalidate on reconnect. Customer B must see Customer A's time as unavailable and not learn Customer A's private identity. On stale UI submission, return conflict + suggested nearby alternatives.
- My Bookings must survive reload, logout/relogin and second device, with address, venue photo, start/end, duration, total, payment status, QR code, cancellation/refund status and map directions.
- Existing confirmed reservations must never disappear during migrations or redesigns. Preserve data IDs and links or provide backwards-compatible redirects.

## 11B. OPENAI AI CONCIERGE — ACTUAL BACKEND INTEGRATION

Build a functional, helpful **SpaceHub AI** assistant visible as (a) an accessible floating support/chat launcher and (b) a full `/ai-assistant` page. Uzbek is default, Russian and English supported. It must answer questions and help users search, choose and compare real venues using authorized current marketplace data.

### Backend and tools

1. Use maintained official OpenAI SDK **Responses API**, invoked in a **server-only** Next.js route/service. Do not use retired Assistants API or put requests with the API key directly in browser code.
2. Store model selection in `OPENAI_MODEL` and validate availability via current API docs. Do not hardcode a speculative model name or silently fallback to an unconfigured one.
3. Build an explicit read-only tool layer such as `search_venues`, `get_venue_details`, `get_resource_availability`, `calculate_booking_quote`, `compare_venues`, `get_policy`, `get_my_bookings` (authenticated and owner checked). Validate structured tool arguments on the server.
4. AI must NEVER invent venue names, actual addresses, photos, ratings, availability, merchant payments or booking status. It may suggest only records returned by its authorized tools, with live prices and server-side verified availability where needed.
5. AI can draft a booking selection and take user to checkout but must **not charge, confirm, cancel or modify bookings without explicit user confirmation and authenticated server-side authorization**. Do not let the model call privileged database mutations directly.
6. Defend against prompt injection from venue descriptions, support tickets and user messages. Do not let external content override the assistant's instructions or authorize data leaks. Limit accessible tools and output fields.
7. Set per-account/IP rate limits, strict input-size bounds, request timeout/cancellation, retry policy, token/usage logging, daily/monthly cost limits and a feature flag to disable expensive AI endpoints in production.
8. Do not send phone numbers, payment credentials, service-role secrets or unrelated user PII to the model. Respect privacy and obtain user consent as required.
9. Support streamed text if the chosen model/SDK supports it reliably; show clear loading, unavailable and error states. Fall back gracefully to ordinary search and FAQ if OpenAI credentials or network access are missing.
10. Add AI interaction tests: grounding, tool authorization, injection resistance, cost/rate limits, nonexistent venue queries, unavailable dates, and correct Uzbek/Russian/English behavior.

### AI interface details

- Premium assistant chat with suggested prompts, venue preview cards (only real database matches), clear price/address/availability links, chat reset, copy responses and navigation to real venue pages.
- Example suggested prompts: “Chilonzorda ertaga kechqurun bo‘sh futbol maydonlarini ko‘rsat”; “20 kishilik konferensiya xonasi kerak”; “2 ta coworking joyini narxi va imkoniyatlari bo‘yicha solishtir”.
- Chat must distinguish factual, verified live availability from general suggestions. Provide timestamps for availability checks and revalidate before purchase.

## 11C. ORIGINAL IMAGES, LOGO AND ASSET GENERATION (NOT RANDOM STOCK)

The user explicitly wants the project to **create its own visual assets**, not show unrelated photos or broken placeholder boxes. Build a complete asset workflow with professional, coherent creative direction.

### Design identity and visual system

- Brand: **SpaceHub UZ**. Create an original brandmark, scalable vector logo (SVG), mono/light/dark versions, favicon, social preview and a modern editorial visual identity. Avoid copying any competitor's marks or layouts.
- Design: elegant, sophisticated, attractive but readable. High-quality hero area, strong typography, spacious cards, one primary accent, map/search integration, convincing booking details, well-structured modern admin dashboard. Never use generic fake logos, cluttered gradients or inconsistent icon families.
- Colors: light `#F8FAFC` background, `#FFFFFF` surfaces, `#0F172A` text, blue `#2563EB` actions, teal/green `#10B981` success; compatible dark tokens. Respect color contrast and WCAG 2.2 AA where feasible. Use Geist or Inter. Mobile first with no overflow.

### Generate assets and actually save files

1. Inspect what Antigravity tools are genuinely available. If an image-generation capability is available, use it to create original branded static visuals. If using an API, support a server-only, **budget-controlled** script using the official OpenAI image-generation API with `OPENAI_IMAGE_MODEL` configured to a currently supported image model. Do not fabricate generated images when the tool/API cannot run.
2. Create a practical asset inventory and generate/save real files under `public/images/generated/` or upload through an authorized Supabase Storage workflow. Deliver a manifest indicating each file, prompt, usage, dimensions, generation source and whether the file was successfully produced.
3. First batch: 2 hero concepts (responsive desktop/mobile crops), 4 unique category banners (coworking, sport, meeting, events), 8 original **illustrative demo card images** (2 per category), 4 helpful empty-state illustrations, 3 onboarding/FAQ visuals, one social preview, logo and icons. Aim for 20+ meaningful visual assets, but do not run expensive generations without configured credentials and budget; prioritize best-impact assets first.
4. Use image prompts that specify plausible Uzbekistan urban and architectural contexts, natural light, professional composition, realistic room proportions, consistent premium editorial photography aesthetic, subtle brand color accents, no watermarks, no embedded fake text, no repeated background assets, and no unrelated objects. Each category must look like its category.
5. **Critical truthfulness:** AI-generated illustrations/visualizations are NOT photographic evidence of a real venue. Clearly label demo/concept assets where used; only approved owner-uploaded or otherwise verified real venue-specific photographs may represent an actual bookable property. For production listings with no verified photos, show a professional **neutral illustration**, never a fabricated realistic photo passed off as that venue.
6. Owner uploads must not be overwritten by generated images. Add moderation, alt text, crop/focal points, ordering, cover selection and ability to replace any demo visuals with real images. Avoid unauthorized copying of other sites' assets.
7. Optimize output to modern formats and multiple sizes when supported. Use Next.js `<Image>` or equivalent optimization, responsive `sizes`, image quality settings, alt text and lazy loading, without hurting LCP for above-fold hero media.
8. If image generation cannot run because no credentials/tool exists, produce working original SVG logo/icons/abstract illustrations yourself, create detailed generation prompt files and a tested generation script or setup guide, leave accurate TODO status. **Never claim raster images were generated unless the files exist.**
9. Generate attractive visuals for customer website and operational dashboard (charts are backed by real data, not fake statistics). Do not turn admin UI into excessive decorative art.
10. Run an asset-audit test: each visible card has a correct asset or truthful neutral fallback, every image path resolves, no broken image icons or unmatched categories, and no unlicensed externally scraped media.

## 11D. PREMIUM UX: 37+ REAL ROUTES, COMPLETE FLOWS

In addition to the 26 essential routes listed above, include dedicated fully functional page/route flows where justified, such as category search routes (`/explore/coworking`, `/explore/sports`, `/explore/meetings`, `/explore/events`), `/compare`, `/account/payment-history`, `/account/reviews`, `/account/notifications`, `/account/security`, `/help`, `/about`, `/legal/privacy`, `/legal/terms`, `/ai-assistant`, and booking confirmation/detail routes. Route structure can differ, but deliver **at least 37 distinct meaningful user/owner/admin screens**, never 37 empty duplicates. Use proper dynamic routes so category and venue-specific content differ.

### Customer journey

1. Guest enters polished homepage and finds real category cards, practical popular destinations and search with dates, capacity and neighborhood.
2. Search returns real, filterable and sortable approved venue inventory and optional interactive map; show fee-inclusive prices where possible.
3. Venue detail shows location/address, verified actual images or labeled concept placeholder, individual rooms/courts, facilities, schedules, availability, safety/rules and real reviews.
4. Customer chooses start/end time, selects extras, sees price breakdown and policies, signs in with +998 OTP if necessary, then confirms through secure checkout.
5. Customer receives a truthful status, booking ID, directions, QR when applicable, messages/reminders, and owner receives a matching reservation.
6. Customer returns days later, signs in from another device and still sees all reservations. They can cancel/request refund under explicit rules, rebook after a fresh availability check, contact support, save venue or review after eligible visit.

### Design acceptance

- Beautiful, consistent original visual language across Home, Browse, Detail, Calendar, Checkout, Profile, Owner portal, and Admin dashboard; all designed deliberately, not assembled from random unrelated templates.
- Usable on 360px mobile, common tablets and large desktops; no horizontally clipped navigation, working mobile menu, keyboard navigation, visible focus, reduced motion, theme and language persistence.
- Strong empty, loading, error, permission-denied and no-results states.
- Admin portal includes bookings/resources chart, search/filter tables, export with access controls, revenue/occupancy/cancellation metrics derived from database, accurate statuses and audit trails.

## 11E. PRODUCTION SECURITY, PAYMENTS, OPERATIONAL READINESS

- Separate local, staging and production Supabase projects/environments if resources permit; never use destructive development seeds against production.
- Payments for Uzbekistan: implement verified integration adapters for Click/Payme only after officially supported merchant setup. Until then use a **clearly identified test mode**, or allowed pay-at-venue workflow; do not fabricate proof of online payment, settlements, refunds or payout completion.
- Verify webhook signatures and event provenance, enforce idempotency, handle retries, partial/out-of-order webhook events and financial reconciliation. Use integer minor units or exact decimals for UZS.
- Secure booking cancellation/refund with explicit policy acceptance and ownership checks; rate-limit costly or dangerous operations; configure upload size limits, sanitation and malware scanning where appropriate.
- HTTPS, sensible security headers, safe logging, protected cron jobs, no publicly callable admin mutation with secret key, no auth bypass, CSP strategy, secrets only on trusted server, dependency audit, privacy-aware analytics and appropriate data retention.
- Add backups, restore instructions, migration rollbacks where safe, environment validation, monitor/alert setup, user-friendly 404/500 pages, sitemap, robots, structured metadata, canonical URLs, error boundaries and payment/SMS/API outage behavior.
- Never display fake seed reviews or inflated ratings in production. Keep unverified demo venues excluded from live search unless specifically marked demo.
- Check local regulations/terms with the operator before launching identity collection, merchant transactions or marketing communications; do not claim legal compliance without review.
- Test with `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, plus browser end-to-end tests. Add CI, concurrency tests, RLS policy tests and staging smoke tests. Fix errors rather than hiding them.
- Provide a concise **GO-LIVE GATE** checklist: verified domain, production Supabase project, migrations, enabled RLS, real SMS/OTP, merchant provider approval, OpenAI budget/keys, webhook URL, asset audit, admin provisioning, backups, monitoring, legal/support pages, accessibility and successful staging checkout.
- Never claim "production-ready" is synonymous with "publicly deployed". Report precisely what is implemented, what is tested and what is blocked by credentials or merchant approval.

## 12. TEN IMPLEMENTATION PHASES WITH ACCEPTANCE CRITERIA

### PHASE 1 — Project setup and system architecture

- Inspect repository; initialize Next.js App Router, TypeScript and Tailwind CSS when not already present.
- Define folder structure, design tokens, lint/format/typecheck, project README and `.env.example`.
- Document role diagram, database design and booking state machine before building booking UI.
- Configure CI and baseline test framework.
  **Gate:** repository starts, typecheck/lint succeed, architecture is documented.

### PHASE 2 — Design system and customer-facing shell

- Original visual identity, reusable components, responsive navbar/footer, localization and theme switching.
- Functional Home, Explore, Listing details and Map scaffolds using clearly labeled development seed data.
- Real navigation, search/filter interactions, accessible forms and loading states.
- Create original SVG brand assets and generate/curate truthful branded category/hero demo images per Section 11C, actually saving image files with manifest.
  **Gate:** responsive layout on phone/tablet/desktop, no nonfunctional visible controls, all major routes resolve.

### PHASE 3 — Database, backend and authorization foundations

- Supabase PostgreSQL + Supabase Auth SSR + Prisma/SQL migrations, secured API, validation, query architecture, Storage and RLS policies/tests.
- Resource-level availability model and database-level overlap protection planning/implementation.
- Audit logs and authorization guards for each role.
  **Gate:** database tests pass; unauthorized API access is rejected; migrations work from clean DB.

### PHASE 4 — Authentication, user onboarding and customer profile

- Phone +998 validation with Supabase Auth OTP/SMS provider adapter, registration/login, session handling and logout.
- Profile photo, rich preferences, favorites and editable identity fields.
- Guest browsing stays available; booking requires verified user.
  **Gate:** profile persists across reload/devices; identity verification and security tests pass.

### PHASE 5 — Venue, resource and booking engine

- Owner venue creation, per-resource calendars, opening hours, price schedules and blocks.
- Search filters and booking UX with interval selection and time zone handling.
- Atomic booking/hold/confirmation state machine and conflict responses.
- My Bookings detail: address/map/time/QR/status timeline.
  **Gate:** two simultaneous bookings cannot occupy the same slot; booked slots update for other customers; booking persists after logout/relogin.

### PHASE 6 — Payments, cancellation and notifications

- Secure payment adapters, provider webhook validation, financial state transitions, refunds and cancellation policies.
- Telegram operational bot, notification templates, queues, reminders and delivery logs.
- Price breakdown and truthful checkout status.
  **Gate:** repeated webhooks do not double-charge/create bookings; payment failure and hold expiry leave correct inventory state.

### PHASE 7 — Owner dashboard and venue operations

- Full 7-page owner experience, multiple venues/branches/resources and team access.
- Booking approvals, schedule blocks, media, analytics and earnings.
  **Gate:** owner cannot change another owner's venue; confirmed customer booking appears in owner dashboard.

### PHASE 8 — Admin console and moderation

- Full 9-page admin experience: users, approvals, listings, bookings, transactions, analytics, support, audit and settings.
- Least-privilege role enforcement and secure administrative actions.
  **Gate:** no public access to restricted pages/API; all privileged operations auditable.

### PHASE 9 — Advanced customer-value features

- Implement remaining mandatory 30 features plus high-value differentiators: compare, waitlist, recurring reservations, QR, add-ons, optional group booking, calendar export, corporate flows where practical.
- Implement the server-only OpenAI Responses AI concierge with strict grounding, rate/cost controls, fail-safe UI, test coverage and actual configured credentials.
- Finish 37+ meaningful routes/screens and image asset inventory with truthful real-photo-versus-illustration labeling.
- Complete i18n translations, mobile polish, accessibility and performance improvement.
  **Gate:** features use real persisted data and correct policies; no decorative/fake functionality.

### PHASE 10 — QA, security, launch readiness and deployment

- Automated unit/integration/E2E/race tests, Supabase RLS + Storage policy tests, OpenAI/tool authorization tests, security review, rate limit verification, observability/logging.
- Error handling, SEO, asset optimization, backup/restore plan, staging smoke tests, production-ready `.env.example` and deploy guide.
- Deploy only when actual accounts/credentials are available; otherwise provide exact unfulfilled integration/setup checklist without claiming go-live.
  **Gate:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (or equivalent commands) pass; migration/backup and E2E workflow documented and verified where environment permits.

## 13. MANDATORY END-TO-END SCENARIOS

Write real automated tests with an isolated test PostgreSQL database and production-equivalent constraints:

1. Register a customer with valid OTP in test mode and save a profile picture.
2. Register/approve an owner, create a venue, add two independently bookable rooms/courts with schedules.
3. Customer A books resource 1 from 10:00 to 11:00, receives confirmation and sees address/time/booking ID.
4. Customer B sees the same slot BOOKED and cannot select or confirm it.
5. Two customers simultaneously submit overlapping time intervals; only one can reserve inventory, with understandable failure for the other.
6. Customer A refreshes, closes site, logs out, logs in on another device: booking remains in My Bookings.
7. Owner immediately sees new reservation, correctly scoped to own venue; another owner cannot see customer-private details.
8. Customer cancels under a refundable policy; availability updates and refund state is recorded accurately.
9. Abandoned booking hold expires; slot reopens through durable processing.
10. Duplicate and delayed payment callbacks cannot create duplicate reservations or bypass state checks.
11. Invalid time zones, DST transitions in expansion markets, midnight-crossing durations and overlapping maintenance blocks are handled safely.
12. Customer cannot retrieve another customer's booking by guessing ID; non-admin cannot invoke admin endpoints.
13. Venue-specific actual image/media and add-on totals appear consistently in listing and checkout.
14. Mobile nav, UZ/RU/EN switch and dark/light themes remain functional.
15. SMS/Telegram/email failures do not silently lose booking records; delivery can be retried.
16. Search, price filter, location search, favorites, reviews and account deletion follow permissions and persisted state.

## 14. FINAL DELIVERY REQUIREMENTS

At completion provide:

- Working organized project repository with all significant source files and real API endpoints.
- Database schema, reviewed migrations and safe dev seed instructions.
- Premium original redesign with 37+ real screens/routes, generated/original marketing visuals, verified actual venue photography policy, customer website + separate owner portal + protected admin console.
- Functional booking engine with server-verified availability and durable history.
- Supabase Auth, PostgreSQL, Storage, Realtime and RLS setup plus OpenAI Responses API integration, budget controls and explicit activation status.
- Payment/SMS/Telegram integration implementations and explicit activation status.
- Automated tests, their actual results and unresolved environment blockers.
- Environment-variable template with no real secrets and a step-by-step Supabase/OpenAI connection guide with provider limitations, staging and production setup.
- README covering local setup, production deployment, backups and operator admin bootstrap.
- A phase-by-phase implementation checklist marking each feature **implemented**, **tested**, **blocked by credentials**, or **not completed** (never mark untested as tested).

**Additional core promise:** AI and imagery must make the marketplace more helpful and visually exceptional without making up places, pretending demonstration images are real photos, exposing secrets or bypassing booking protections.

**Core promise:** If customer A booked a venue/resource at a given time, customer B sees that time as booked and cannot double-book it; customer A still sees their booking, venue address and dates after logging out and back in. Build the product around making this promise demonstrably true.

## 15. ANTIGRAVITY AGENT EXECUTION PROTOCOL — FOLLOW EXACTLY

1. **Use the existing `spacehub uz` workspace.** Before editing, print the actual project path and detect the project root (`package.json`, app route structure, Git status). Read the entire existing code and earlier specification. Do not overwrite user data or rename repository without approval.
2. Make a safe Git checkpoint. Check database and migrations first; protect persistent data before altering table definitions. If no Git, initialize a repository or make a local safe snapshot without removing files.
3. Output an audit matrix: DONE, BROKEN, MISSING, BLOCKED BY CREDENTIALS. Prioritize fixes. Show which components/routes and files will change.
4. Implement phases 1–10 in the correct order, but integrate Supabase + auth and the availability constraint **before** making live booking UI claims. For every phase, edit actual source files rather than only explaining possible changes.
5. After each phase run the relevant verification scripts, show exact command and PASS/FAIL, fix failures, and maintain `IMPLEMENTATION_STATUS.md` with honest status and a checklist.
6. The AI/asset phases MUST include actual routes/components/scripts/assets; if remote credentials absent, implement graceful degraded paths and exact provider setup steps; do not falsely claim API connections.
7. Always keep `README.md`, `ENV_SETUP.md`, `.env.example`, and `DEPLOYMENT_CHECKLIST.md` synchronized. Never write real credentials into them.
8. Before deployment, generate full production preflight: `database migration`, `RLS`, `login`, `double-booking concurrency`, `AI grounding`, `photos`, `SMS`, `payments`, `admin security`, `privacy`, `observability`, `backups`, `responsive QA`.
9. Use trustworthy current official docs for Next.js, Tailwind, Supabase and OpenAI to verify exact SDK method names. Avoid deprecated APIs and guesses. No paid API usage unless the appropriate account is configured and the approved budget permits it.
10. At the very end, report a compact release table: area, implemented, tests, blocked items and next action. If anything was not verified, say so. Do not promise a complete fully working live service until it has been actually tested and deployed.

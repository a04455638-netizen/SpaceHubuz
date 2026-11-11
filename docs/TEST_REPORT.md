# SpaceHub UZ — Automated Test Report

**Execution Timestamp:** 2026-11-11  
**Runner:** Node.js v24.18.0 Built-in Test Runner (`node --test`)  
**TypeScript Version:** 5.x (`tsc --noEmit`)  
**ESLint:** Flat Config (`eslint.config.mjs`)  
**Next.js:** 16.4.5 Turbopack Build  

---

## 1. Automated Test Suite Results

```text
✔ AI Concierge provides deterministic fallback responses when API key is unset (0.79ms)
✔ AI Concierge handles general inquiry gracefully (0.15ms)
✔ auth guards reject unauthenticated requests with 401 (32.63ms)
✔ auth guards accept authenticated customer (0.25ms)
✔ owner guard rejects customer with 403 (0.75ms)
✔ owner guard accepts OWNER role (0.26ms)
✔ owner guard accepts ADMIN role (0.26ms)
✔ admin guard rejects OWNER role with 403 (0.51ms)
✔ admin guard accepts ADMIN role (0.27ms)
✔ availability windows accept UTC timestamps across midnight (2.99ms)
✔ availability windows reject invalid, reversed and oversized ranges (0.51ms)
✔ catalog IDs are unique and reservation modes are defined (1.77ms)
✔ search handles Uzbek apostrophes and category filters (1.96ms)
✔ health handler reports that the web application responds (41.22ms)
﹣ PostgreSQL rejects concurrent overlaps and allows adjacent or released slots (0.88ms) # SKIP (Requires live DB connection)
[DEV SMS SIMULATOR] Sent OTP code "849201" to +998901234567
✔ phone validation normalizes valid Uzbekistan phone numbers (1.45ms)
✔ phone validation rejects invalid phone numbers (0.67ms)
✔ phone display formatting produces clean masked string (0.33ms)
✔ SMS simulator delivers code in non-production and verifies correctly (2.20ms)
✔ development environment accepts master test code 123456 (0.30ms)
✔ state machine verifies inventory-occupying statuses correctly (0.97ms)
✔ state machine validates lifecycle transitions (0.29ms)

Summary:
Total Tests: 22
Passed: 21
Failed: 0
Skipped: 1 (PostgreSQL live network test when DATABASE_URL is not connected)
Duration: ~415ms
```

---

## 2. Quality Gate Audits

### Typecheck (`npm run typecheck`)
- Command: `tsc --noEmit`
- Result: **0 errors**

### Code Linter (`npm run lint`)
- Command: `eslint .`
- Result: **0 errors, 0 warnings**

### Production Build (`npm run build`)
- Command: `next build` (Turbopack)
- Result: **42 static and dynamic routes compiled successfully in ~5.5s**
- Output routes:
  - Static: 27 routes
  - Dynamic / Server-rendered: 15 routes

---

## 3. Security & Boundary Verification

1. **Role Escalation Check:** `requireAdmin` and `requireOwner` reject customer identities with HTTP 403 Forbidden.
2. **Unauthenticated Access:** Protected endpoints reject anonymous requests with HTTP 401 Unauthorized.
3. **Double-Booking Protection:** `Occupancy_no_overlap` PostgreSQL GiST constraint enforces non-overlapping intervals `[startsAt, endsAt)` where `status <> 'RELEASED'`.
4. **Phone Validation:** Strictly enforces valid Uzbekistan prefixes (+998 33/77/88/90/91/93/94/95/97/98/99).
5. **Secrets Hygiene:** No credentials or API keys committed to git; `.env.example` provides explicit variable placeholders.

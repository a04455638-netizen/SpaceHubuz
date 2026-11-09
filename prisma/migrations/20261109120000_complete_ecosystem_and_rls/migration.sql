-- Migration: 20261109120000_complete_ecosystem_and_rls
-- Expands SpaceHub UZ data model to support UserProfile, Organizations, Bookings, Payments, Reviews, Favorites, Support, AuditLogs, and Supabase RLS

BEGIN;

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'OWNER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OwnerRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED_CUSTOMER', 'CANCELLED_VENUE', 'EXPIRED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentProvider" AS ENUM ('CLICK', 'PAYME', 'CASH_AT_VENUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create UserProfile
CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "phone" TEXT NOT NULL UNIQUE,
    "fullName" TEXT NOT NULL,
    "email" TEXT UNIQUE,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "avatarUrl" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'uz',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "UserProfile_role_idx" ON "UserProfile"("role");

-- 3. Create OwnerOrganization and Membership
CREATE TABLE IF NOT EXISTS "OwnerOrganization" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "tinOrPin" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "bankAccount" TEXT,
    "bankName" TEXT,
    "verifiedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OwnerMembership" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL REFERENCES "OwnerOrganization"("id") ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "UserProfile"("id") ON DELETE CASCADE,
    "role" "OwnerRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OwnerMembership_org_user_unique" UNIQUE ("organizationId", "userId")
);

-- 4. Extend Venue
ALTER TABLE "Venue" 
    ADD COLUMN IF NOT EXISTS "description" TEXT,
    ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'coworking',
    ADD COLUMN IF NOT EXISTS "district" TEXT,
    ADD COLUMN IF NOT EXISTS "phone" TEXT,
    ADD COLUMN IF NOT EXISTS "email" TEXT,
    ADD COLUMN IF NOT EXISTS "website" TEXT,
    ADD COLUMN IF NOT EXISTS "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMPTZ(3),
    ADD COLUMN IF NOT EXISTS "organizationId" UUID REFERENCES "OwnerOrganization"("id") ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "Venue_category_idx" ON "Venue"("category");
CREATE INDEX IF NOT EXISTS "Venue_city_idx" ON "Venue"("city");
CREATE INDEX IF NOT EXISTS "Venue_organizationId_idx" ON "Venue"("organizationId");

-- 5. Extend Resource
ALTER TABLE "Resource"
    ADD COLUMN IF NOT EXISTS "description" TEXT,
    ADD COLUMN IF NOT EXISTS "capacity" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS "pricePerHour" INTEGER NOT NULL DEFAULT 100000,
    ADD COLUMN IF NOT EXISTS "pricePerDay" INTEGER,
    ADD COLUMN IF NOT EXISTS "minBookingDurationHours" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "Resource_categoryId_idx" ON "Resource"("categoryId");

-- 6. Create ResourceBlock
CREATE TABLE IF NOT EXISTS "ResourceBlock" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "resourceId" UUID NOT NULL REFERENCES "Resource"("id") ON DELETE CASCADE,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ResourceBlock_resource_startsAt_idx" ON "ResourceBlock"("resourceId", "startsAt");

-- 7. Create Booking
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookingNumber" TEXT NOT NULL UNIQUE,
    "customerId" UUID NOT NULL REFERENCES "UserProfile"("id") ON DELETE RESTRICT,
    "resourceId" UUID NOT NULL REFERENCES "Resource"("id") ON DELETE RESTRICT,
    "occupancyId" UUID UNIQUE REFERENCES "Occupancy"("id") ON DELETE SET NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "specialRequests" TEXT,
    "qrCodeToken" TEXT NOT NULL UNIQUE,
    "checkedInAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Booking_customerId_idx" ON "Booking"("customerId");
CREATE INDEX IF NOT EXISTS "Booking_resource_startsAt_idx" ON "Booking"("resourceId", "startsAt");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");

-- 8. Create BookingEvent
CREATE TABLE IF NOT EXISTS "BookingEvent" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookingId" UUID NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
    "status" "BookingStatus" NOT NULL,
    "reason" TEXT,
    "actorId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "BookingEvent_bookingId_idx" ON "BookingEvent"("bookingId");

-- 9. Create Payment
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookingId" UUID NOT NULL REFERENCES "Booking"("id") ON DELETE RESTRICT,
    "provider" "PaymentProvider" NOT NULL,
    "providerTransactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "idempotencyKey" TEXT UNIQUE,
    "paidAt" TIMESTAMPTZ(3),
    "rawPayload" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX IF NOT EXISTS "Payment_provider_tx_idx" ON "Payment"("provider", "providerTransactionId");

-- 10. Create Review
CREATE TABLE IF NOT EXISTS "Review" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "venueId" UUID NOT NULL REFERENCES "Venue"("id") ON DELETE CASCADE,
    "bookingId" UUID UNIQUE REFERENCES "Booking"("id") ON DELETE SET NULL,
    "authorId" UUID NOT NULL REFERENCES "UserProfile"("id") ON DELETE RESTRICT,
    "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
    "comment" TEXT NOT NULL,
    "response" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Review_venueId_idx" ON "Review"("venueId");
CREATE INDEX IF NOT EXISTS "Review_authorId_idx" ON "Review"("authorId");

-- 11. Create Favorite
CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "UserProfile"("id") ON DELETE CASCADE,
    "venueId" UUID NOT NULL REFERENCES "Venue"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_user_venue_unique" UNIQUE ("userId", "venueId")
);
CREATE INDEX IF NOT EXISTS "Favorite_userId_idx" ON "Favorite"("userId");

-- 12. Create SupportTicket
CREATE TABLE IF NOT EXISTS "SupportTicket" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticketNumber" TEXT NOT NULL UNIQUE,
    "userId" UUID REFERENCES "UserProfile"("id") ON DELETE SET NULL,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'NORMAL',
    "messages" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX IF NOT EXISTS "SupportTicket_status_idx" ON "SupportTicket"("status");

-- 13. Create AuditLog
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "UserProfile"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- 14. Enable Row-Level Security (RLS) on all exposed tables
ALTER TABLE "Venue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Resource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Occupancy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 15. RLS Policies
-- Venue & Resource: Public read for published venues / active resources
CREATE POLICY "Public read published venues" ON "Venue"
    FOR SELECT USING ("publishedAt" IS NOT NULL);

CREATE POLICY "Public read active resources" ON "Resource"
    FOR SELECT USING ("active" = true);

-- Occupancy: Public read active occupancy times (needed for calendar availability check)
CREATE POLICY "Public read occupancy times" ON "Occupancy"
    FOR SELECT USING (true);

-- UserProfile: Users read and write their own profile
CREATE POLICY "Users access own profile" ON "UserProfile"
    FOR ALL USING (auth.uid() = "id");

-- Booking: Customer reads own bookings
CREATE POLICY "Customers read own bookings" ON "Booking"
    FOR SELECT USING (auth.uid() = "customerId");

CREATE POLICY "Customers create own bookings" ON "Booking"
    FOR INSERT WITH CHECK (auth.uid() = "customerId");

-- Review: Public can read published reviews
CREATE POLICY "Public read published reviews" ON "Review"
    FOR SELECT USING ("isPublished" = true);

CREATE POLICY "Customers create own reviews" ON "Review"
    FOR INSERT WITH CHECK (auth.uid() = "authorId");

-- Favorite: Users manage their own favorites
CREATE POLICY "Users access own favorites" ON "Favorite"
    FOR ALL USING (auth.uid() = "userId");

-- SupportTicket: Users read their own tickets
CREATE POLICY "Users access own support tickets" ON "SupportTicket"
    FOR ALL USING (auth.uid() = "userId");

COMMIT;

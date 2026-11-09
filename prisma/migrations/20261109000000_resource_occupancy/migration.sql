BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE "OccupancyStatus" AS ENUM ('HELD', 'REQUESTED', 'CONFIRMED', 'BLOCKED', 'RELEASED');

CREATE TABLE "Venue" (
    "id" UUID PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Tashkent',
    "publishedAt" TIMESTAMPTZ(3)
);

CREATE TABLE "Resource" (
    "id" UUID PRIMARY KEY,
    "venueId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Resource_venueId_fkey" FOREIGN KEY ("venueId")
        REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Occupancy" (
    "id" UUID PRIMARY KEY,
    "resourceId" UUID NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "OccupancyStatus" NOT NULL,
    "expiresAt" TIMESTAMPTZ(3),
    CONSTRAINT "Occupancy_resourceId_fkey" FOREIGN KEY ("resourceId")
        REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occupancy_ordered_interval" CHECK ("startsAt" < "endsAt"),
    CONSTRAINT "Occupancy_pending_expiration"
        CHECK ("status" NOT IN ('HELD', 'REQUESTED') OR "expiresAt" IS NOT NULL),
    CONSTRAINT "Occupancy_no_overlap" EXCLUDE USING gist (
        "resourceId" WITH =,
        tstzrange("startsAt", "endsAt", '[)') WITH &&
    ) WHERE ("status" <> 'RELEASED')
);

CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
CREATE INDEX "Resource_venueId_idx" ON "Resource"("venueId");
CREATE INDEX "Occupancy_resourceId_startsAt_idx" ON "Occupancy"("resourceId", "startsAt");

COMMIT;

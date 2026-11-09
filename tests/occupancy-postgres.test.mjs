import assert from "node:assert/strict";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const enabled = process.env.RUN_POSTGRES_TESTS === "1";

test(
  "PostgreSQL rejects concurrent overlaps and allows adjacent or released slots",
  { skip: !enabled },
  async () => {
    const db = new PrismaClient();
    const venueId = randomUUID();
    const resourceId = randomUUID();
    const occupy = (start, end) => db.$executeRaw`
    INSERT INTO "Occupancy" ("id", "resourceId", "startsAt", "endsAt", "status")
    VALUES (${randomUUID()}::uuid, ${resourceId}::uuid, ${start}::timestamptz,
            ${end}::timestamptz, 'CONFIRMED')
  `;

    try {
      await db.venue.create({
        data: {
          id: venueId,
          slug: venueId,
          name: "Test",
          city: "Test",
          address: "Test",
        },
      });
      await db.resource.create({
        data: { id: resourceId, venueId, name: "Test", categoryId: "sports" },
      });
      const start = "2026-11-09T05:00:00Z";
      const end = "2026-11-09T06:00:00Z";
      const outcomes = await Promise.allSettled([
        occupy(start, end),
        occupy(start, end),
      ]);
      assert.equal(
        outcomes.filter(({ status }) => status === "fulfilled").length,
        1,
      );
      const rejected = outcomes.find(({ status }) => status === "rejected");
      assert.equal(rejected.reason.meta.code, "23P01");
      await occupy(end, "2026-11-09T07:00:00Z");
      await db.occupancy.updateMany({
        where: { resourceId, startsAt: new Date(start) },
        data: { status: "RELEASED" },
      });
      await occupy(start, end);
    } finally {
      try {
        await db.occupancy.deleteMany({ where: { resourceId } });
        await db.resource.deleteMany({ where: { id: resourceId } });
        await db.venue.deleteMany({ where: { id: venueId } });
      } finally {
        await db.$disconnect();
      }
    }
  },
);

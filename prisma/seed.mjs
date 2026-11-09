import { PrismaClient } from "@prisma/client";

if (
  process.env.NODE_ENV === "production" ||
  process.env.SPACEHUB_DEV_SEED !== "1"
) {
  throw new Error(
    "Use SPACEHUB_DEV_SEED=1 with a dedicated development database.",
  );
}

const db = new PrismaClient();
const slug = "dev-sample-venue";
const resourceId = "a5548ac0-538f-4b79-8996-7ed13947f20c";

try {
  await db.$transaction(async (tx) => {
    const venue = await tx.venue.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: "Demo — o‘quv xonasi",
        city: "Toshkent",
        address: "Sinov manzili",
        publishedAt: new Date(),
      },
    });
    await tx.resource.upsert({
      where: { id: resourceId },
      update: {},
      create: {
        id: resourceId,
        venueId: venue.id,
        name: "Demo xona",
        categoryId: "work",
        active: true,
      },
    });
  });
} finally {
  await db.$disconnect();
}

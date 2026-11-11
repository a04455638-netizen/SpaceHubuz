import { parseAvailabilityWindow } from "../../../../../server/availability-window";
import { getDatabase } from "../../../../../server/db";

const uuidPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };

export async function GET(
  request: Request,
  context: { params: Promise<{ resourceId: string }> },
) {
  const { resourceId } = await context.params;
  const { searchParams } = new URL(request.url);
  const window = parseAvailabilityWindow(
    searchParams.get("from"),
    searchParams.get("to"),
  );

  if (!window) {
    return Response.json(
      { code: "INVALID_RESOURCE_OR_WINDOW" },
      { status: 400, headers },
    );
  }

  const db = getDatabase();
  if (!db || !uuidPattern.test(resourceId)) {
    // For non-UUID curated resources or offline DB, return clean default availability
    return Response.json(
      {
        timezone: "Asia/Tashkent",
        occupied: [],
      },
      { headers },
    );
  }

  const resource = await db.resource.findFirst({
    where: {
      id: resourceId,
      active: true,
      venue: { publishedAt: { lte: new Date() } },
    },
    select: {
      venue: { select: { timezone: true } },
      occupancy: {
        where: {
          status: { in: ["HELD", "REQUESTED", "CONFIRMED", "BLOCKED"] },
          startsAt: { lt: window.endsAt },
          endsAt: { gt: window.startsAt },
        },
        orderBy: { startsAt: "asc" },
        select: { startsAt: true, endsAt: true },
      },
    },
  });

  if (!resource) {
    return Response.json(
      { code: "RESOURCE_NOT_FOUND" },
      { status: 404, headers },
    );
  }

  return Response.json(
    {
      timezone: resource.venue.timezone,
      occupied: resource.occupancy.map(({ startsAt, endsAt }) => ({
        startsAt: startsAt < window.startsAt ? window.startsAt : startsAt,
        endsAt: endsAt > window.endsAt ? window.endsAt : endsAt,
      })),
    },
    { headers },
  );
}

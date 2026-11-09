const instantPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const maxWindowMs = 31 * 24 * 60 * 60 * 1000;

function parseInstant(input: string | null) {
  if (!input || !instantPattern.test(input)) return null;
  const date = new Date(input);
  if (!Number.isFinite(date.getTime())) return null;
  const canonical = input.includes(".") ? input : input.replace("Z", ".000Z");
  return date.toISOString() === canonical ? date : null;
}

export function parseAvailabilityWindow(
  from: string | null,
  to: string | null,
) {
  const startsAt = parseInstant(from);
  const endsAt = parseInstant(to);
  if (!startsAt || !endsAt) return null;
  const duration = endsAt.getTime() - startsAt.getTime();
  if (duration <= 0 || duration > maxWindowMs) return null;

  return { startsAt, endsAt };
}

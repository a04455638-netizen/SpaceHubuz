"use client";

import { useState, type FormEvent } from "react";

type Slot = { startsAt: string; endsAt: string };
type Result = { date: string; slots: Slot[] } | { error: string };

export function OccupancyViewer({
  resourceId,
  timezone,
}: {
  resourceId: string;
  timezone: string;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const format = new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: timezone,
  });

  async function load(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const date = String(new FormData(event.currentTarget).get("date") ?? "");
    setResult(null);
    setLoading(true);

    try {
      // Pad the UTC day to cover every local instant on the selected date.
      const utc = Date.parse(date + "T00:00:00Z");
      const day = 24 * 60 * 60 * 1000;
      const query = new URLSearchParams({
        from: new Date(utc - day).toISOString(),
        to: new Date(utc + day * 2).toISOString(),
      });
      const response = await fetch(
        `/api/resources/${resourceId}/occupancy?${query}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("Occupancy request failed");

      const { occupied } = (await response.json()) as { occupied: Slot[] };
      const localDate = new Intl.DateTimeFormat("sv-SE", {
        dateStyle: "short",
        timeZone: timezone,
      });
      const slots = occupied.filter(
        ({ startsAt, endsAt }) =>
          localDate.format(new Date(startsAt)) <= date &&
          localDate.format(new Date(Date.parse(endsAt) - 1)) >= date,
      );
      setResult({ date, slots });
    } catch {
      setResult({
        error: "Band vaqtlarni yuklab bo‘lmadi. Qayta urinib ko‘ring.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={load} className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm font-semibold">
          Sana ({timezone})
          <input
            type="date"
            name="date"
            required
            min="2000-01-01"
            max="2099-12-31"
            disabled={loading}
            className="rounded-lg border border-ink/30 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Yuklanmoqda…" : "Band vaqtlarni ko‘rish"}
        </button>
      </form>
      <div className="mt-3 text-sm" aria-live="polite">
        {result &&
          ("error" in result ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p className="font-semibold">{result.date}</p>
              {result.slots.length ? (
                <ul className="mt-2 space-y-1">
                  {result.slots.map(({ startsAt, endsAt }) => (
                    <li key={startsAt}>
                      {format.format(new Date(startsAt))} –{" "}
                      {format.format(new Date(endsAt))}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Bu sanada band vaqt qayd etilmagan.</p>
              )}
            </>
          ))}
      </div>
    </>
  );
}

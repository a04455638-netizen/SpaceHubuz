import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mening sharhlarim | SpaceHub UZ",
};

export default function AccountReviewsPage() {
  const reviews = [
    {
      id: "rev_1",
      venueName: "C-Space Mirabad",
      rating: 5,
      date: "2026-11-06",
      comment:
        "Juda ajoyib sokin muhit. Internet tezligi barqaror va kofe burchagi juda yoqdi. Yana albatta kelaman!",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Mening sharhlarim ({reviews.length})
        </h1>
        <p className="text-xs text-ink-muted">
          Tashrif buyurgan joylaringiz bo‘yicha qoldirgan baholaringiz
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{r.venueName}</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                {"★".repeat(r.rating)}
              </div>
            </div>
            <p className="mt-3 text-xs text-ink leading-relaxed">{r.comment}</p>
            <div className="mt-3 text-[11px] text-ink-subtle">
              Sana: {r.date} · Tasdiqlangan tashrif
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

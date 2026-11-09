import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tahlil va Hisobotlar | SpaceHub Admin",
};

export default function AdminAnalyticsPage() {
  const categoryUtilization = [
    { name: "Kovorking va O‘qish", share: 38, count: "258 ta bron" },
    {
      name: "Sport maydonlari (Futsal, Tennis)",
      share: 34,
      count: "231 ta bron",
    },
    { name: "Majlis va Konferensiya", share: 20, count: "136 ta bron" },
    { name: "Tadbir zallari", share: 8, count: "57 ta bron" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Platforma Tahlili va Hisobotlar
        </h1>
        <p className="text-xs text-ink-muted">
          Kategoriyalar bo‘yicha bandlik ulushi va konversiya ko‘rsatkichlari
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Category Share */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-ink">
            Toifalar bo‘yicha bandlik taqsimoti
          </h3>
          <div className="mt-6 space-y-4">
            {categoryUtilization.map((c) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink">{c.name}</span>
                  <span className="text-ink-muted font-bold">
                    {c.share}% ({c.count})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${c.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-ink">
            Hududiy faollik ko‘rsatkichlari
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
              <span className="font-semibold text-ink">Toshkent shahri</span>
              <span className="font-bold text-accent">72% bronlar</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
              <span className="font-semibold text-ink">Samarqand viloyati</span>
              <span className="font-bold text-accent">14% bronlar</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
              <span className="font-semibold text-ink">Farg‘ona vodiysi</span>
              <span className="font-bold text-accent">8% bronlar</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
              <span className="font-semibold text-ink">
                Buxoro va boshqa viloyatlar
              </span>
              <span className="font-bold text-accent">6% bronlar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

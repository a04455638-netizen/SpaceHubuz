import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcha buyurtmalar | SpaceHub Admin",
};

const allBookings = [
  {
    id: "bkg_nov_101",
    customer: "Aziz Karimov",
    venue: "C-Space Mirabad",
    resource: "Team Desk #2",
    date: "2026-11-10 14:00",
    amount: "90 000 so‘m",
    status: "CONFIRMED",
    payment: "CLICK",
  },
  {
    id: "bkg_nov_102",
    customer: "Sardor Rahimov",
    venue: "Milliy Futsal Arena",
    resource: "Asosiy Futsal Maydoni",
    date: "2026-11-10 18:00",
    amount: "180 000 so‘m",
    status: "CONFIRMED",
    payment: "PAYME",
  },
  {
    id: "bkg_nov_099",
    customer: "Nodira Karimova",
    venue: "TechPark Grand Conference",
    resource: "Katta anjumanlar zali",
    date: "2026-11-09 10:00",
    amount: "700 000 so‘m",
    status: "COMPLETED",
    payment: "CLICK",
  },
];

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Barcha buyurtmalar monitoringi
        </h1>
        <p className="text-xs text-ink-muted">
          Platforma bo‘yicha barcha faol, yakunlangan va bekor qilingan bronlar
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Buyurtma ID</th>
              <th className="p-4 font-bold">Mijoz</th>
              <th className="p-4 font-bold">Obyekt va Resurs</th>
              <th className="p-4 font-bold">Vaqt</th>
              <th className="p-4 font-bold">Summa</th>
              <th className="p-4 font-bold">To‘lov</th>
              <th className="p-4 font-bold">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allBookings.map((b) => (
              <tr key={b.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4 font-mono font-bold text-ink">#{b.id}</td>
                <td className="p-4 font-semibold text-ink">{b.customer}</td>
                <td className="p-4">
                  <p className="font-bold text-ink">{b.venue}</p>
                  <p className="text-[11px] text-ink-subtle">{b.resource}</p>
                </td>
                <td className="p-4 text-ink-muted">{b.date}</td>
                <td className="p-4 font-bold text-accent">{b.amount}</td>
                <td className="p-4 font-semibold text-ink">{b.payment}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold ${
                      b.status === "CONFIRMED"
                        ? "bg-status-success-bg text-status-success"
                        : "bg-surface-muted text-ink-muted"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

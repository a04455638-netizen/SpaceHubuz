"use client";

import { useState } from "react";

export default function AdminDiscountsPage() {
  const [promos, setPromos] = useState([
    {
      code: "SPACEHUB2026",
      discount: "15%",
      category: "Barcha toifalar",
      expiry: "2026-12-31",
      usageLimit: 500,
      usedCount: 142,
      active: true,
    },
    {
      code: "FUTSAL10",
      discount: "10%",
      category: "Sport maydonlari",
      expiry: "2026-11-30",
      usageLimit: 200,
      usedCount: 78,
      active: true,
    },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10%");

  function handleCreatePromo(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim()) return;

    setPromos((prev) => [
      ...prev,
      {
        code: newCode.toUpperCase(),
        discount: newDiscount,
        category: "Barcha toifalar",
        expiry: "2026-12-31",
        usageLimit: 100,
        usedCount: 0,
        active: true,
      },
    ]);
    setNewCode("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Promo-kodlar va Chegirma Aksiyalari
        </h1>
        <p className="text-xs text-ink-muted">
          Marketing aksiyalari uchun promo-kodlarni boshqarish
        </p>
      </div>

      {/* Create Promo Code */}
      <form
        onSubmit={handleCreatePromo}
        className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
      >
        <h3 className="text-sm font-bold text-ink">Yangi promo-kod yaratish</h3>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="PROMO KODI (masalan, NAVROZ20)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono font-bold text-ink uppercase focus:border-accent focus:outline-none"
          />
          <input
            type="text"
            required
            placeholder="Chegirma (masalan, 15% yoki 20 000 UZS)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="w-48 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-ink focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white shadow hover:bg-accent-hover transition"
          >
            Yaratish
          </button>
        </div>
      </form>

      {/* Promos Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Promo-kod</th>
              <th className="p-4 font-bold">Chegirma</th>
              <th className="p-4 font-bold">Amal qilish muddati</th>
              <th className="p-4 font-bold">Ishlatildi</th>
              <th className="p-4 font-bold">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promos.map((p) => (
              <tr key={p.code}>
                <td className="p-4 font-mono font-bold text-accent">
                  {p.code}
                </td>
                <td className="p-4 font-bold text-ink">{p.discount}</td>
                <td className="p-4 text-ink-muted">{p.expiry}</td>
                <td className="p-4 text-ink">
                  {p.usedCount} / {p.usageLimit}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-status-success-bg px-2.5 py-0.5 font-bold text-status-success">
                    FAOL
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

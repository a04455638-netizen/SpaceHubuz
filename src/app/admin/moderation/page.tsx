"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

export default function AdminModerationPage() {
  const [submissions, setSubmissions] = useState([
    {
      id: "ven_mod_01",
      name: "Samarkand Coworking Hub",
      owner: "Farrux Zokirov (STIR: 309876543)",
      city: "Samarqand",
      address: "Rudakiy ko‘chasi, 15",
      resourcesCount: 3,
      submittedAt: "2026-11-09 10:20",
    },
    {
      id: "ven_mod_02",
      name: "Tashkent Padel Club",
      owner: "Padel Sport MCHJ (STIR: 301234567)",
      city: "Toshkent",
      address: "Shayxontohur t., Labzak, 4",
      resourcesCount: 2,
      submittedAt: "2026-11-08 18:45",
    },
  ]);

  const [message, setMessage] = useState("");

  function handleDecision(id: string, approved: boolean) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setMessage(
      approved
        ? `Obyekt tasdiqlandi va ommaviy katalogga chiqarildi.`
        : `Obyekt arizasi rad etildi va egasiga xabarnoma yuborildi.`,
    );
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          E’lonlarni moderatsiya qilish ({submissions.length})
        </h1>
        <p className="text-xs text-ink-muted">
          Yangi joy arizalarini tekshirish va ommaviy ko‘rinishga ruxsat berish
        </p>
      </div>

      {message && (
        <div className="rounded-xl bg-status-success-bg p-3 text-xs font-bold text-status-success">
          {message}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-card p-12 text-center text-xs text-ink-muted">
          Hozirda moderatsiya kutayotgan arizalar mavjud emas. Barcha obyektlar
          ko‘rib chiqilgan.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold text-status-warning">
                      KUTMOQDA
                    </span>
                    <span className="text-[11px] text-ink-subtle">
                      Topshirildi: {sub.submittedAt}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-ink">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Egasi: <strong>{sub.owner}</strong>
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {sub.city}, {sub.address} · {sub.resourcesCount} ta resurs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(sub.id, true)}
                    className="flex items-center gap-1 rounded-xl bg-status-success px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Tasdiqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(sub.id, false)}
                    className="flex items-center gap-1 rounded-xl border border-status-danger bg-status-danger-bg px-4 py-2 text-xs font-bold text-status-danger hover:opacity-90"
                  >
                    <X className="h-4 w-4" /> Rad etish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

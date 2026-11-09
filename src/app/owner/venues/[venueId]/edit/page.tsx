"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";

export default function EditVenuePage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = use(params);
  const [name, setName] = useState("C-Space Mirabad");
  const [city, setCity] = useState("Toshkent");
  const [address, setAddress] = useState("Mirobod tumani, Nukus ko‘chasi, 29");
  const [cancellationPolicy, setCancellationPolicy] = useState("flexible_24h");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/owner/venues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Obyektlar ro‘yxatiga qaytish
      </Link>

      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Obyektni tahrirlash
        </h1>
        <p className="text-xs text-ink-muted">
          Obyekt ID: <code className="font-mono text-xs">{venueId}</code>
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-5"
      >
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" />
            <span>O‘zgarishlar muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Obyekt nomi
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Shahar
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Aniq manzil
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Bekor qilish siyosati
          </label>
          <select
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="flexible_24h">
              Moslashuvchan (24 soat oldin 100% qaytarish)
            </option>
            <option value="moderate_48h">
              O‘rtacha (48 soat oldin 100% qaytarish)
            </option>
            <option value="strict">
              Qat’iy (faqat 72 soat oldin 50% qaytarish)
            </option>
          </select>
        </div>

        <div className="border-t border-border pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
          >
            <Save className="h-4 w-4" />
            <span>Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}

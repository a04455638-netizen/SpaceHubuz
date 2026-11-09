"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2 } from "lucide-react";

export default function NewVenueWizardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("work");
  const [city, setCity] = useState("Toshkent");
  const [address, setAddress] = useState("");
  const [resources, setResources] = useState([
    { name: "Asosiy xona", capacity: 10, price: 50000 },
  ]);
  const [submitted, setSubmitted] = useState(false);

  function addResource() {
    setResources((prev) => [
      ...prev,
      { name: `Resurs #${prev.length + 1}`, capacity: 10, price: 50000 },
    ]);
  }

  function removeResource(index: number) {
    if (resources.length <= 1) return;
    setResources((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/owner/venues");
    }, 1500);
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
          Yangi obyekt qo‘shish
        </h1>
        <p className="text-xs text-ink-muted">
          Platformaga yangi filial yoki sport inshootini joylashtiring
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-border bg-surface-card p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-success-bg text-status-success">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            Obyekt arizasi muvaffaqiyatli topshirildi!
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Platforma moderatori tasdiqlashi bilan ommaviy katalogda ko‘rinadi.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-6"
        >
          {/* Step 1: Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              1. Obyekt ma’lumotlari
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Obyekt nomi
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan, Arena Sport Majmuasi"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Asosiy toifa
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                >
                  <option value="work">Ish va o‘qish (Kovorking)</option>
                  <option value="sports">Sport maydonlari</option>
                  <option value="meetings">Majlis va trening xonalari</option>
                  <option value="events">Tadbir va bayram zallari</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Location */}
          <div>
            <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
              2. Joylashuv
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  placeholder="Ko‘cha, bino raqami, mo‘ljal"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Bookable Resources */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-ink">
                3. Alohida bron qilinadigan resurslar ({resources.length})
              </h3>
              <button
                type="button"
                onClick={addResource}
                className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Resurs qo‘shish
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-border bg-surface p-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Xona yoki maydon nomi"
                    value={res.name}
                    onChange={(e) => {
                      const updated = [...resources];
                      updated[idx].name = e.target.value;
                      setResources(updated);
                    }}
                    className="flex-1 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      placeholder="Sig‘im"
                      value={res.capacity}
                      onChange={(e) => {
                        const updated = [...resources];
                        updated[idx].capacity = Number(e.target.value);
                        setResources(updated);
                      }}
                      className="w-20 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Soatlik narxi (UZS)"
                      value={res.price}
                      onChange={(e) => {
                        const updated = [...resources];
                        updated[idx].price = Number(e.target.value);
                        setResources(updated);
                      }}
                      className="w-32 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                    />
                    {resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResource(idx)}
                        className="text-status-danger hover:opacity-75"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover"
            >
              Arizani topshirish
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

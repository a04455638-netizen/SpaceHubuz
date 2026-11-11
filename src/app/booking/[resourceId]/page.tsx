"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/format-price";

interface Slot {
  startsAt: string;
  endsAt: string;
}

export default function BookingResourcePage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = use(params);
  const router = useRouter();

  const [date, setDate] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );
  const [startHour, setStartHour] = useState("10:00");
  const [durationHours, setDurationHours] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<Slot[]>([]);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestedSlots, setSuggestedSlots] = useState<Array<{ startsAt: string; endsAt: string }>>([]);

  const basePriceHourly = 50000; // 50,000 UZS base

  const addonsList = [
    { id: "wifi_highspeed", name: "Premium Wi-Fi (100 Mbps)", price: 15000 },
    { id: "projector", name: "4K Proyektor va Audio tizim", price: 30000 },
    { id: "coffee", name: "Kofe va choy burchagi", price: 20000 },
  ];

  // Fetch occupied slots for selected resource
  useEffect(() => {
    async function fetchOccupancy() {
      try {
        const utcStart = `${date}T00:00:00Z`;
        const utcEnd = `${date}T23:59:59Z`;
        const res = await fetch(
          `/api/resources/${resourceId}/occupancy?from=${utcStart}&to=${utcEnd}`,
        );
        if (res.ok) {
          const data = (await res.json()) as { occupied: Slot[] };
          setOccupiedSlots(data.occupied || []);
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchOccupancy();
  }, [resourceId, date]);

  // Derived slot overlap check
  const isBooked = occupiedSlots.some((slot) => {
    const startMs = new Date(`${date}T${startHour}:00Z`).getTime();
    const endMs = startMs + durationHours * 3600000;
    const slotStart = new Date(slot.startsAt).getTime();
    const slotEnd = new Date(slot.endsAt).getTime();
    return startMs < slotEnd && endMs > slotStart;
  });

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = addonsList.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const subtotal = basePriceHourly * durationHours;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + addonsTotal + serviceFee;

  async function handleProceed() {
    if (isBooked || creating) return;
    setCreating(true);
    setErrorMessage("");
    setSuggestedSlots([]);

    const startsAt = `${date}T${startHour}:00Z`;
    const endMs = new Date(startsAt).getTime() + durationHours * 3600000;
    const endsAt = new Date(endMs).toISOString();

    try {
      const res = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          startsAt,
          endsAt,
          guestCount: 1,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        // Redirect to login preserving booking intent
        router.push(`/auth/login?redirect=/booking/${resourceId}`);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.message || "Ushbu vaqt band qilingan");
        if (data.suggestedSlots) {
          setSuggestedSlots(data.suggestedSlots);
        }
        setCreating(false);
        return;
      }

      sessionStorage.setItem(
        `booking_${data.bookingId}`,
        JSON.stringify({
          resourceId,
          date,
          startHour,
          durationHours,
          addons: selectedAddons,
          total: data.totalAmount || total,
          expiresAt: data.expiresAt,
        }),
      );

      router.push(`/checkout/${data.bookingId}`);
    } catch {
      setErrorMessage("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/venues/${resourceId}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Orqaga qaytish
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left: Configuration form */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
              Vaqt va Sanani tanlash
            </h1>
            <p className="mt-1 text-xs text-ink-muted">
              Joyning bandligini real vaqtda tekshiring va vaqtni bron qiling
            </p>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-status-danger-bg p-4 text-xs font-semibold text-status-danger">
                <p>{errorMessage}</p>
                {suggestedSlots.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-status-danger/20">
                    <p className="font-bold">Tavsiya etiladigan bo&apos;sh vaqt:</p>
                    {suggestedSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const slotDate = slot.startsAt.split("T")[0];
                          const slotHour = slot.startsAt.split("T")[1]?.slice(0, 5) || "12:00";
                          setDate(slotDate);
                          setStartHour(slotHour);
                          setErrorMessage("");
                        }}
                        className="mt-1 block underline font-bold"
                      >
                        {slot.startsAt.slice(11, 16)} dan {slot.endsAt.slice(11, 16)} gacha
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Sana
                </label>
                <div className="relative mt-1.5">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Boshlanish vaqti
                  </label>
                  <div className="relative mt-1.5">
                    <Clock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
                    >
                      {[
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                        "20:00",
                        "21:00",
                      ].map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Davomiyligi
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
                  >
                    <option value={1}>1 soat</option>
                    <option value={2}>2 soat</option>
                    <option value={3}>3 soat</option>
                    <option value={4}>4 soat</option>
                    <option value={8}>8 soat (Kunlik)</option>
                  </select>
                </div>
              </div>

              {/* Status Alert */}
              <div
                className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  isBooked
                    ? "bg-status-danger-bg text-status-danger"
                    : "bg-status-success-bg text-status-success"
                }`}
              >
                {isBooked ? (
                  <>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                      Ushbu tanlangan vaqt band qilingan. Iltimos, boshqa vaqtni
                      tanlang.
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>Ushbu vaqt oralig&apos;i bo&apos;sh! Darhol band qilishingiz mumkin.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            <h2 className="text-base font-bold text-ink">Qo&apos;shimcha xizmatlar</h2>
            <div className="mt-4 space-y-3">
              {addonsList.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      checked
                        ? "border-accent bg-accent-subtle/30"
                        : "border-border hover:bg-surface-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span className="text-xs font-semibold text-ink">
                        {addon.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-ink">
                      +{formatPrice(addon.price)} UZS
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-ink">To&apos;lov hisobi</h2>

            <div className="space-y-2 text-xs text-ink-muted border-b border-border pb-4">
              <div className="flex justify-between">
                <span>
                  {formatPrice(basePriceHourly)} x {durationHours} soat
                </span>
                <span className="font-semibold text-ink">
                  {formatPrice(subtotal)} UZS
                </span>
              </div>

              {addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Qo&apos;shimcha xizmatlar</span>
                  <span className="font-semibold text-ink">
                    {formatPrice(addonsTotal)} UZS
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Xizmat haqi (5%)</span>
                <span className="font-semibold text-ink">
                  {formatPrice(serviceFee)} UZS
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-ink">
              <span>Jami summa:</span>
              <span className="text-base font-extrabold text-accent">
                {formatPrice(total)} UZS
              </span>
            </div>

            <button
              onClick={handleProceed}
              disabled={isBooked || creating}
              className="flex w-full items-center justify-center rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {creating ? "Band qilinmoqda..." : "Bron qilish va to'lovga o'tish"}
            </button>
            <p className="text-center text-[10px] text-ink-subtle">
              15 daqiqalik vaqtinchalik bron (hold) yaratiladi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

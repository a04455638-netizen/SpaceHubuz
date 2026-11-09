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

  function handleProceed() {
    if (isBooked) return;
    setCreating(true);
    // Create hold identifier and redirect to checkout
    const holdId = `bkg_${Date.now().toString(36)}`;
    // Store preliminary hold info in sessionStorage
    sessionStorage.setItem(
      `booking_${holdId}`,
      JSON.stringify({
        resourceId,
        date,
        startHour,
        durationHours,
        addons: selectedAddons,
        total,
      }),
    );
    router.push(`/checkout/${holdId}`);
  }

  const timeSlots = [
    "08:00",
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
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Joy tafsilotlariga qaytish
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
          Vaqtni tanlang va bron qiling
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Resurs ID: <code className="text-xs font-mono">{resourceId}</code>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Form: Date & Slot Picker */}
        <div className="space-y-6 lg:col-span-2">
          {/* Date Picker */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-bold text-ink">
              <CalendarIcon className="h-4 w-4 text-accent" />
              1. Bron sanasini tanlang
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-bold text-ink">
              <Clock className="h-4 w-4 text-accent" />
              2. Boshlanish vaqtini tanlang
            </label>
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-7">
              {timeSlots.map((time) => {
                const isSelected = startHour === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setStartHour(time)}
                    className={`rounded-xl py-2 text-xs font-bold transition ${
                      isSelected
                        ? "bg-accent text-white shadow"
                        : "border border-border bg-surface text-ink hover:border-accent hover:text-accent"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            {/* Duration Selector */}
            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Davomiyligi (soat)
              </label>
              <div className="mt-2 flex gap-3">
                {[1, 2, 3, 4, 8].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDurationHours(hours)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      durationHours === hours
                        ? "bg-ink text-white"
                        : "border border-border bg-surface text-ink hover:border-ink"
                    }`}
                  >
                    {hours} soat
                  </button>
                ))}
              </div>
            </div>

            {/* Conflict Warning */}
            {isBooked ? (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-status-danger-bg p-3.5 text-xs font-semibold text-status-danger">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  Tanlangan vaqt oralig‘i ({startHour} dan{" "}
                  {Number(startHour.split(":")[0]) + durationHours}:00 gacha)
                  boshqa mijoz tomonidan allaqachon band qilingan. Iltimos,
                  boshqa vaqtni tanlang.
                </span>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-semibold text-status-success">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>Tanlangan vaqt bo‘sh va bron qilish mumkin!</span>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink">
              3. Qo‘shimcha xizmatlar (ixtiyoriy)
            </h3>
            <div className="mt-3 space-y-2.5">
              {addonsList.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                      checked
                        ? "border-accent bg-accent-subtle/40"
                        : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="h-4 w-4 rounded accent-accent"
                      />
                      <span className="text-sm font-medium text-ink">
                        {addon.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-accent">
                      +{addon.price.toLocaleString("uz-UZ")} so‘m
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="h-fit rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
          <h2 className="text-base font-bold text-ink">Hisob-kitob</h2>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="flex justify-between">
              <span>Sana:</span>
              <span className="font-semibold text-ink">{date}</span>
            </div>
            <div className="flex justify-between">
              <span>Vaqt:</span>
              <span className="font-semibold text-ink">
                {startHour} ({durationHours} soat)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Asosiy ijara:</span>
              <span className="font-semibold text-ink">
                {subtotal.toLocaleString("uz-UZ")} so‘m
              </span>
            </div>
            {addonsTotal > 0 && (
              <div className="flex justify-between">
                <span>Qo‘shimcha xizmatlar:</span>
                <span className="font-semibold text-ink">
                  {addonsTotal.toLocaleString("uz-UZ")} so‘m
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Xizmat haqi (5%):</span>
              <span className="font-semibold text-ink">
                {serviceFee.toLocaleString("uz-UZ")} so‘m
              </span>
            </div>

            <div className="my-2 border-t border-border pt-2 flex justify-between text-base font-extrabold text-ink">
              <span>Jami:</span>
              <span className="text-accent">
                {total.toLocaleString("uz-UZ")} so‘m
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={isBooked || creating}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white shadow transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Yuklanmoqda…" : "To‘lovga o‘tish"}
          </button>

          <p className="mt-3 text-center text-xs text-ink-subtle">
            Keyingi qadamda Click yoki Payme orqali to‘lash mumkin
          </p>
        </div>
      </div>
    </main>
  );
}

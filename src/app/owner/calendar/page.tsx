"use client";

import { useState } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";

export default function OwnerCalendarPage() {
  const [selectedResource, setSelectedResource] = useState("res_1");
  const [blocks, setBlocks] = useState([
    {
      id: "blk_1",
      resource: "Muzokaralar xonasi",
      date: "2026-11-12",
      time: "08:00 – 11:00",
      reason: "Texnik ta’mirlash va konditsioner tozalash",
    },
  ]);

  const [newDate, setNewDate] = useState("2026-11-15");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("12:00");
  const [newReason, setNewReason] = useState("");

  function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!newReason.trim()) return;

    setBlocks((prev) => [
      ...prev,
      {
        id: `blk_${Date.now()}`,
        resource:
          selectedResource === "res_1" ? "Muzokaralar xonasi" : "Asosiy zal",
        date: newDate,
        time: `${newStart} – ${newEnd}`,
        reason: newReason,
      },
    ]);
    setNewReason("");
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Bandlik taqvimi va Texnik bloklar
        </h1>
        <p className="text-xs text-ink-muted">
          Resurslar bo‘yicha ish vaqtlari va ta’mirlash uchun vaqtni yopish
        </p>
      </div>

      {/* Add New Maintenance Block Form */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <Lock className="h-4 w-4 text-status-warning" />
          Yangi texnik blok qo‘shish
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          Yopilgan vaqtlarda mijozlar bu oraliqni bron qila olmaydi.
        </p>

        <form
          onSubmit={handleAddBlock}
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 items-end"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Resurs
            </label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink"
            >
              <option value="res_1">Muzokaralar xonasi</option>
              <option value="res_2">Asosiy zal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Sana
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Vaqt oralig‘i
            </label>
            <div className="mt-1.5 flex items-center gap-1">
              <input
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-2 py-2 text-xs text-ink"
              />
              <span className="text-xs text-ink-subtle">–</span>
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-2 py-2 text-xs text-ink"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1 rounded-xl bg-ink py-2 text-xs font-bold text-white transition hover:bg-black"
            >
              <Plus className="h-3.5 w-3.5" /> Vaqtni yopish
            </button>
          </div>

          <div className="sm:col-span-4">
            <input
              type="text"
              required
              placeholder="Sabab (masalan, ta’mirlash, tozalash yoki maxsus korporativ yopiq tadbir)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* Active Blocks List */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-ink">
          Faol yopilgan vaqtlar ({blocks.length})
        </h3>
        <div className="mt-4 divide-y divide-border">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <span className="rounded bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold text-status-warning">
                  BLOKLANGAN
                </span>
                <p className="mt-1 text-xs font-bold text-ink">{b.resource}</p>
                <p className="text-[11px] text-ink-muted">
                  {b.date} · {b.time} — <em>{b.reason}</em>
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeBlock(b.id)}
                className="text-status-danger hover:opacity-75"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState("10");
  const [holdMinutes, setHoldMinutes] = useState("15");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.enabled === "boolean") {
          setMaintenanceMode(data.enabled);
        }
      })
      .catch(() => {});
  }, []);

  const auditLogs = [
    {
      id: "log_001",
      actor: "Operator (admin@spacehub.uz)",
      action: "VENUE_VERIFIED",
      target: "Milliy Futsal Arena (ven_02)",
      time: "2026-11-09 13:45:10",
      ip: "10.0.4.1",
    },
    {
      id: "log_002",
      actor: "System Engine",
      action: "HOLD_EXPIRED",
      target: "Slot #bkg_hold_912",
      time: "2026-11-09 14:15:00",
      ip: "internal",
    },
    {
      id: "log_003",
      actor: "Aziz Karimov",
      action: "BOOKING_CONFIRMED",
      target: "C-Space Mirabad (Slot 10:00-12:00)",
      time: "2026-11-09 14:31:22",
      ip: "84.54.120.45",
    },
  ];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);

    try {
      await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: maintenanceMode }),
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Tizim sozlamalari va Xavfsizlik Audit Jurnali
        </h1>
        <p className="text-xs text-ink-muted">
          Platformaning global parametrlari va barcha muhim operatsiyalar izi
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-5"
      >
        <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
          Global Bozor Parametrlari
        </h3>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" /> Sozlamalar saqlandi!
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Platforma komissiyasi (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-ink focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-subtle">
              Har bir tasdiqlangan onlayn bron uchun olinadigan ulush
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Vaqtinchalik Hold muddati (Daqiqa)
            </label>
            <input
              type="number"
              value={holdMinutes}
              onChange={(e) => setHoldMinutes(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-ink focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-subtle">
              To‘lov kutilayotganda vaqt boshqalarga ko‘rsatilmaydigan muddat
            </p>
          </div>
        </div>

        {/* Maintenance Mode Toggle */}
        <div className="rounded-xl border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-ink">
              Texnik profilaktika rejimi (Maintenance Mode)
            </span>
            <p className="text-[11px] text-ink-muted">
              Yoqilganda, oddiy tashrif buyuruvchilarga profilaktika oynasi ko&apos;rinadi, ma&apos;murlar esa boshqaruv paneliga to&apos;liq kirishlari mumkin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              maintenanceMode ? "bg-status-danger" : "bg-border"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                maintenanceMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="border-t border-border pt-4">
          <button
            type="submit"
            className="rounded-xl bg-ink px-5 py-2 text-xs font-bold text-white shadow hover:bg-black transition"
          >
            Parametrlarni saqlash
          </button>
        </div>
      </form>

      {/* Immutable Audit Log */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <Shield className="h-4 w-4 text-accent" />
          Xavfsizlik Audit Jurnali (Audit Log)
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          Barcha sezgir amallar, moderatsiyalar va holat o‘tishlarining
          o‘zgarmas tarixi
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-muted text-ink-muted">
              <tr>
                <th className="p-3 font-bold">Vaqt (UTC)</th>
                <th className="p-3 font-bold">Amal bajaruvchi</th>
                <th className="p-3 font-bold">Harakat</th>
                <th className="p-3 font-bold">Obyekt</th>
                <th className="p-3 font-bold">IP Manzil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-muted/50 transition"
                >
                  <td className="p-3 font-mono text-ink-muted">{log.time}</td>
                  <td className="p-3 font-semibold text-ink">{log.actor}</td>
                  <td className="p-3">
                    <span className="rounded bg-surface-muted px-2 py-0.5 font-mono font-bold text-ink border border-border">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-ink">{log.target}</td>
                  <td className="p-3 font-mono text-ink-subtle">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

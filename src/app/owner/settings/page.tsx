"use client";

import { useState } from "react";
import { Send, Users, Save, Check } from "lucide-react";

export default function OwnerSettingsPage() {
  const [orgName, setOrgName] = useState("SpaceHub Partner OOO");
  const [taxId, setTaxId] = useState("309 123 456");
  const [telegramChatId, setTelegramChatId] = useState("@spacehub_alerts_bot");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("OWNER_STAFF");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Tashkilot sozlamalari va Telegram
        </h1>
        <p className="text-xs text-ink-muted">
          Yuridik ma’lumotlar, xodimlar huquqlari va operatsion xabarnomalar
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-6"
      >
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" /> Sozlamalar saqlandi!
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-ink border-b border-border pb-2">
            1. Yuridik tashkilot ma’lumotlari
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Tashkilot nomi (Yuridik)
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                STIR (ИНН)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink border-b border-border pb-2">
            <Send className="h-4 w-4 text-accent" />
            2. Telegram bot operatsion xabarnomalari
          </h3>
          <p className="mt-2 text-xs text-ink-muted">
            Yangi buyurtmalar va bekor qilishlar haqida Telegram orqali lahzali
            xabarlar olish uchun bot bilan bog‘lang.
          </p>
          <div className="mt-3 max-w-md">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Telegram Chat ID / Username
            </label>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink border-b border-border pb-2">
            <Users className="h-4 w-4 text-accent" />
            3. Xodimlar va Rollar (Staff Permissions)
          </h3>
          <p className="mt-2 text-xs text-ink-muted">
            Administrator va xodimlaringizga faqat belgilangan resurslar
            bo‘yicha QR chek-in qilish huquqini bering.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Xodim elektron pochtasi yoki telefon raqami"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
            />
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-ink"
            >
              <option value="OWNER_STAFF">Xodim (Faqat QR Chek-in)</option>
              <option value="OWNER_MANAGER">
                Menejer (Jadval &amp; Buyurtmalar)
              </option>
            </select>
            <button
              type="button"
              className="rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-black transition"
            >
              Biriktirish
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
          >
            <Save className="h-4 w-4" />
            <span>Sozlamalarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}

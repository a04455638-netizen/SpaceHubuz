"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function AccountNotificationsPage() {
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [telegramOptIn, setTelegramOptIn] = useState(true);
  const [remindersOptIn, setRemindersOptIn] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Xabarnomalar sozlamalari
        </h1>
        <p className="text-xs text-ink-muted">
          Bron tasdiqlari va eslatmalarni qanday qabul qilishni belgilang
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-5">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" /> Sozlamalar yangilandi!
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-surface-muted/30">
          <div>
            <h4 className="text-sm font-bold text-ink">SMS Xabarnomalar</h4>
            <p className="text-xs text-ink-muted">
              Buyurtma tasdiqlanganda va to‘lov cheki bo‘yicha SMS olish
            </p>
          </div>
          <input
            type="checkbox"
            checked={smsOptIn}
            onChange={(e) => setSmsOptIn(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-surface-muted/30">
          <div>
            <h4 className="text-sm font-bold text-ink">
              Telegram Bot Eslatmalari
            </h4>
            <p className="text-xs text-ink-muted">
              Bron vaqtidan 2 soat oldin bot orqali bepul eslatma olish
            </p>
          </div>
          <input
            type="checkbox"
            checked={telegramOptIn}
            onChange={(e) => setTelegramOptIn(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-surface-muted/30">
          <div>
            <h4 className="text-sm font-bold text-ink">Maxsus Takliflar</h4>
            <p className="text-xs text-ink-muted">
              Yangi ochilgan joylar va bayram aksiyalari haqida xabardor bo‘lish
            </p>
          </div>
          <input
            type="checkbox"
            checked={remindersOptIn}
            onChange={(e) => setRemindersOptIn(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
        </label>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Phone, Sparkles, X, Check, ArrowRight } from "lucide-react";

export function WelcomePhoneModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("+998 ");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has already entered a phone or was already prompted
    const existingPhone = localStorage.getItem("spacehub_user_phone");
    const wasPrompted = localStorage.getItem("spacehub_welcome_prompted");

    if (!existingPhone && !wasPrompted) {
      // Delay slightly so the page loads smoothly before showing the modal
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    // Mark as prompted so it is NEVER asked again
    localStorage.setItem("spacehub_welcome_prompted", "true");
    setIsOpen(false);
  }

  function handlePhoneChange(value: string) {
    if (!value.startsWith("+998")) {
      setPhone("+998 ");
      return;
    }
    setPhone(value);
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 12) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting (+998 XX XXX XX XX)");
      return;
    }

    setLoading(true);
    setError("");

    const cleanPhone = `+${digits}`;
    const name = fullName.trim() || "Mijoz";

    // 1. Save to localStorage immediately
    localStorage.setItem("spacehub_user_phone", cleanPhone);
    localStorage.setItem("spacehub_user_name", name);
    localStorage.setItem("spacehub_welcome_prompted", "true");

    // 2. Set cookies for server guards
    document.cookie = `spacehub_user_phone=${encodeURIComponent(cleanPhone)}; path=/; max-age=31536000; SameSite=Lax`;
    const userObj = {
      id: `c1234567-0000-0000-0000-${digits.slice(-12).padStart(12, "0")}`,
      phone: cleanPhone,
      fullName: name,
      role: "CUSTOMER",
    };
    localStorage.setItem("spacehub_user", JSON.stringify(userObj));
    document.cookie = `spacehub_user=${encodeURIComponent(JSON.stringify(userObj))}; path=/; max-age=31536000; SameSite=Lax`;

    // 3. Register/login on backend silently
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, fullName: name }),
      });
    } catch {
      // ignore
    }

    setLoading(false);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-surface-card p-6 sm:p-8 shadow-2xl transition-all space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink transition cursor-pointer"
          aria-label="Yopish"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent shadow-inner">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-ink sm:text-2xl">
            SpaceHub UZ ga xush kelibsiz!
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Joy va sport maydonlarini 1 daqiqada tez va oson bron qilish uchun telefon raqamingizni kiriting.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-status-danger-bg p-3 text-xs font-semibold text-status-danger text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Telefon raqamingiz
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+998 90 123 45 67"
                required
                autoFocus
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Ismingiz (Ixtiyoriy)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masalan: Sardor"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                "Saqlanmoqda..."
              ) : (
                <>
                  <span>Saqlash va davom etish</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs font-semibold text-ink-muted hover:text-ink transition cursor-pointer text-center"
            >
              Keyinroq eslatish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
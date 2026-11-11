"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function AccountProfilePage() {
  const [fullName, setFullName] = useState("Aziz Karimov");
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [email, setEmail] = useState("aziz.karimov@example.uz");
  const [language, setLanguage] = useState("uz");
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedPhone = localStorage.getItem("spacehub_user_phone");
      const savedName = localStorage.getItem("spacehub_user_name");
      const savedTheme = localStorage.getItem("spacehub_theme");
      const savedLang = localStorage.getItem("spacehub_locale");

      if (savedPhone) setPhone(savedPhone);
      if (savedName) setFullName(savedName);
      if (savedTheme) setTheme(savedTheme);
      if (savedLang) setLanguage(savedLang);

      // Fetch fresh profile from API
      fetch("/api/account/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.profile) {
            if (data.profile.fullName) setFullName(data.profile.fullName);
            if (data.profile.phone) setPhone(data.profile.phone);
            if (data.profile.email) setEmail(data.profile.email);
            if (data.profile.preferredLanguage) setLanguage(data.profile.preferredLanguage);
          }
        })
        .catch(() => {});
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem("spacehub_user_name", fullName);
    localStorage.setItem("spacehub_user_phone", phone);
    localStorage.setItem("spacehub_locale", language);
    localStorage.setItem("spacehub_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    // Sync cookies for server recognition
    document.cookie = `spacehub_user_phone=${encodeURIComponent(phone)}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      const existing = localStorage.getItem("spacehub_user");
      const baseObj = existing ? JSON.parse(existing) : {};
      const updatedUser = {
        ...baseObj,
        fullName,
        phone,
        preferredLanguage: language,
      };
      localStorage.setItem("spacehub_user", JSON.stringify(updatedUser));
      document.cookie = `spacehub_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }

    try {
      await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email, preferredLanguage: language }),
      });
    } catch {
      // Local changes still preserved
    }

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Mijoz profili
        </h1>
        <p className="text-xs text-ink-muted">
          Shaxsiy ma&apos;lumotlaringiz va ilova sozlamalari
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-6"
      >
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3.5 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" />
            <span>Profil ma&apos;lumotlari muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              To&apos;liq ism
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={fullName}
                required
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Telefon raqami
            </label>
            <div className="relative mt-1.5">
              <input
                type="tel"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Elektron pochta (Ixtiyoriy)
            </label>
            <div className="relative mt-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Afzal til
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="uz">O&apos;zbekcha (Default)</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Mavzu
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="light">Yorug&apos; mavzu (Light)</option>
              <option value="dark">Qorong&apos;i mavzu (Dark)</option>
            </select>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover disabled:opacity-60 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saqlanmoqda..." : "O&apos;zgarishlarni saqlash"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

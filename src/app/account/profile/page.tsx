"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function AccountProfilePage() {
  const [firstName, setFirstName] = useState("Aziz");
  const [lastName, setLastName] = useState("Karimov");
  const [phone] = useState("+998 90 123 45 67");
  const [email, setEmail] = useState("aziz.karimov@example.uz");
  const [language, setLanguage] = useState("uz");
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedFirst = localStorage.getItem("spacehub_user_first");
      const savedLast = localStorage.getItem("spacehub_user_last");
      if (savedFirst) setFirstName(savedFirst);
      if (savedLast) setLastName(savedLast);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("spacehub_user_first", firstName);
    localStorage.setItem("spacehub_user_last", lastName);
    localStorage.setItem("spacehub_locale", language);
    localStorage.setItem("spacehub_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

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
          Shaxsiy ma’lumotlaringiz va ilova sozlamalari
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-6"
      >
        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-status-success-bg p-3.5 text-xs font-semibold text-status-success">
            <Check className="h-4 w-4" />
            <span>Profil ma’lumotlari muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Ism
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Familiya
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Telefon raqami (Tasdiqlangan)
            </label>
            <div className="relative mt-1.5">
              <input
                type="text"
                disabled
                value={phone}
                className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm font-semibold text-ink-muted"
              />
            </div>
          </div>

          <div>
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
              <option value="uz">O‘zbekcha (Default)</option>
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
              <option value="light">Yorug‘ mavzu (Light)</option>
              <option value="dark">Qorong‘i mavzu (Dark)</option>
            </select>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover"
          >
            <Save className="h-4 w-4" />
            <span>O‘zgarishlarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+998 ");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Tizimga kirishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      // Store in localStorage for fast client hydration
      localStorage.setItem("spacehub_auth_verified", "true");
      localStorage.setItem("spacehub_user_id", data.user.id);
      localStorage.setItem("spacehub_user_phone", data.user.phone);
      localStorage.setItem("spacehub_user_name", data.user.fullName);

      // Check for redirect query parameter
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/account/profile";
      router.push(redirectUrl);
    } catch {
      setError("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <Image
            src="/brand/icon.svg"
            alt="SpaceHub UZ"
            width={48}
            height={48}
            className="mx-auto h-12 w-12"
          />
          <h1 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">
            Tizimga kirish
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            Telefon raqamingiz orqali tezkor va xavfsiz kiring (SMS kodsiz)
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-status-danger-bg p-3 text-xs font-semibold text-status-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Ism va familiyangiz (ixtiyoriy)
            </label>
            <input
              type="text"
              value={fullName}
              placeholder="Alisher Navoiy"
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Telefon raqamingiz
            </label>
            <div className="relative mt-1.5">
              <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
              <input
                type="tel"
                value={phone}
                required
                placeholder="+998 90 123 45 67"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-muted p-2.5 text-[11px] text-ink-muted">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Tasdiqlash kodi talab etilmaydi — bir tugma bilan profilingiz ochiladi.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Kirilmoqda..." : "Tizimga kirish"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-muted">
          Davom etish orqali siz{" "}
          <Link href="/legal/terms" className="text-accent hover:underline">
            Foydalanish shartlari
          </Link>{" "}
          va{" "}
          <Link href="/legal/privacy" className="text-accent hover:underline">
            Maxfiylik siyosatiga
          </Link>{" "}
          rozilik bildirasiz.
        </p>
      </div>
    </main>
  );
}

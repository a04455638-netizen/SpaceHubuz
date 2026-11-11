"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("+998 ");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "SMS kod yuborishda xatolik yuz berdi");
        return;
      }

      setNotice(data.message);
      setStep("otp");
    } catch {
      setError("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Iltimos, 6 xonali tasdiqlash kodini kiriting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Kod noto'g'ri yoki muddati o'tgan");
        return;
      }

      // Store in localStorage for fast client hydration
      localStorage.setItem("spacehub_auth_verified", "true");
      localStorage.setItem("spacehub_user_id", data.user.id);
      localStorage.setItem("spacehub_user_phone", data.user.phone);
      localStorage.setItem("spacehub_user_name", data.user.fullName);

      router.push("/account/profile");
    } catch {
      setError("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
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
            {step === "phone" ? "Tizimga kirish" : "SMS kodni tasdiqlang"}
          </h1>
          <p className="mt-1 text-xs text-ink-muted">
            {step === "phone"
              ? "Telefon raqamingiz orqali xavfsiz kiring"
              : `${phone} raqamiga yuborilgan 6 xonali kodni kiriting`}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-status-danger-bg p-3 text-xs font-semibold text-status-danger text-center">
            {error}
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-xl bg-status-info-bg p-3 text-xs font-semibold text-status-info text-center">
            {notice}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Yuborilmoqda..." : "SMS kod olish"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Tasdiqlash kodi
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                required
                placeholder="123456"
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-center font-mono text-lg font-bold tracking-widest text-ink focus:border-accent focus:outline-none"
              />
              <p className="mt-2 text-center text-[11px] text-ink-subtle">
                Test muhitida ixtiyoriy 6 xonali kod (masalan,{" "}
                <button
                  type="button"
                  onClick={() => setOtp("123456")}
                  className="font-bold underline text-accent"
                >
                  123456
                </button>
                ) qabul qilinadi
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Tekshirilmoqda..." : "Tasdiqlash va Kirish"}
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-xs font-semibold text-accent hover:underline pt-2 cursor-pointer"
            >
              Raqamni o&apos;zgartirish
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-[11px] text-ink-subtle">
            Kirish orqali siz{" "}
            <Link href="/legal/terms" className="text-accent underline">
              Foydalanish shartlari
            </Link>{" "}
            va{" "}
            <Link href="/legal/privacy" className="text-accent underline">
              Maxfiylik siyosatiga
            </Link>{" "}
            rozilik bildirasiz.
          </p>
        </div>
      </div>
    </main>
  );
}

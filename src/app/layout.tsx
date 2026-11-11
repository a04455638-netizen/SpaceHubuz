import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { FloatingConcierge } from "../components/ai/floating-concierge";
import { I18nProvider, type Locale } from "../lib/i18n";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://spacehub.uz"),
  title: "SpaceHub UZ — O‘zbekistonda joylar va maydonlar bron qilish",
  description:
    "Kovorking, sport maydonlari (futsal, tennis), konferensiya zallari va tadbir joylarini real vaqtda ishonchli bron qiling.",
  icons: {
    icon: "/brand/icon.svg",
    apple: "/brand/icon.svg",
  },
  openGraph: {
    title: "SpaceHub UZ — Joylar va zallarni ishonchli bron qilish",
    description:
      "Toshkent va butun O'zbekiston bo'ylab kovorking, sport zallari va tadbir maydonlari.",
    url: "https://spacehub.uz",
    siteName: "SpaceHub UZ",
    images: [
      {
        url: "/images/generated/hero-banner.svg",
        width: 1200,
        height: 630,
        alt: "SpaceHub UZ Platform",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const saved = cookieStore.get("spacehub_locale")?.value;
  const initialLocale: Locale =
    saved === "ru" || saved === "en" || saved === "uz" ? saved : "uz";

  return (
    <html lang={initialLocale} data-theme="light" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased selection:bg-accent-subtle selection:text-accent">
        <I18nProvider initialLocale={initialLocale}>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <FloatingConcierge />
        </I18nProvider>
      </body>
    </html>
  );
}

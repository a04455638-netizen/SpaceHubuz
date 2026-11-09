import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { FloatingConcierge } from "../components/ai/floating-concierge";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaceHub UZ — O‘zbekistonda joylar va maydonlar bron qilish",
  description:
    "Kovorking, sport maydonlari (futsal, tennis), konferensiya zallari va tadbir joylarini real vaqtda ishonchli bron qiling.",
  icons: {
    icon: "/brand/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" data-theme="light">
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased selection:bg-accent-subtle selection:text-accent">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingConcierge />
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function FloatingConcierge() {
  const pathname = usePathname();

  // Admin panelda AI tugmasi ko'rinmasin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      aria-label="AI Concierge Quick Access"
      className="fixed bottom-6 right-6 z-30"
    >
      <Link
        href="/ai-assistant"
        className="group flex items-center gap-2.5 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-accent-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-4 w-4 animate-pulse text-white" />
        </span>
        <span className="hidden sm:inline">SpaceHub AI</span>
      </Link>
    </aside>
  );
}

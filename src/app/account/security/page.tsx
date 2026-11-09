"use client";

import { useState } from "react";
import { Smartphone, Laptop, LogOut } from "lucide-react";

export default function AccountSecurityPage() {
  const [sessions, setSessions] = useState([
    {
      id: "sess_curr",
      device: "Windows Chrome (Joriy qurilma)",
      ip: "84.54.120.45 (Toshkent)",
      lastActive: "Hozir faol",
      current: true,
      icon: Laptop,
    },
    {
      id: "sess_mobile",
      device: "iPhone 15 — Safari",
      ip: "84.54.120.45 (Toshkent)",
      lastActive: "2 soat oldin",
      current: false,
      icon: Smartphone,
    },
  ]);

  function terminateSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Xavfsizlik va Seanslar
        </h1>
        <p className="text-xs text-ink-muted">
          Akkauntingizga ulangan qurilmalar va sessiyalarni boshqaring
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-ink">Faol sessiyalar</h3>
        <div className="mt-4 divide-y divide-border">
          {sessions.map((sess) => {
            const Icon = sess.icon;
            return (
              <div
                key={sess.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-ink">
                        {sess.device}
                      </p>
                      {sess.current && (
                        <span className="rounded-full bg-status-success-bg px-2 py-0.5 text-[10px] font-bold text-status-success">
                          Joriy
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-subtle">
                      IP: {sess.ip} · {sess.lastActive}
                    </p>
                  </div>
                </div>

                {!sess.current && (
                  <button
                    type="button"
                    onClick={() => terminateSession(sess.id)}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-status-danger hover:bg-status-danger-bg transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Chiqarish</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

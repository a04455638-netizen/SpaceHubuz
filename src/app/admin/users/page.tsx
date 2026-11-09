"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: "usr_01",
      name: "Aziz Karimov",
      phone: "+998 90 123 45 67",
      role: "CUSTOMER",
      verified: true,
      status: "FAOL",
    },
    {
      id: "usr_02",
      name: "C-Space Management",
      phone: "+998 99 888 77 66",
      role: "OWNER",
      verified: true,
      status: "FAOL",
    },
    {
      id: "usr_03",
      name: "Support Operator 1",
      phone: "+998 97 555 44 33",
      role: "SUPPORT_AGENT",
      verified: true,
      status: "FAOL",
    },
  ]);

  function changeRole(id: string, newRole: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Foydalanuvchilar va Rollar (RBAC)
        </h1>
        <p className="text-xs text-ink-muted">
          Platformadagi barcha foydalanuvchilar va ularga biriktirilgan huquqlar
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Foydalanuvchi</th>
              <th className="p-4 font-bold">Telefon (+998)</th>
              <th className="p-4 font-bold">Verifikatsiya</th>
              <th className="p-4 font-bold">Rol</th>
              <th className="p-4 font-bold">Holat</th>
              <th className="p-4 font-bold text-right">Rolni o‘zgartirish</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4">
                  <p className="font-bold text-ink">{u.name}</p>
                  <p className="text-ink-subtle text-[11px]">ID: {u.id}</p>
                </td>
                <td className="p-4 font-mono text-ink">{u.phone}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2 py-0.5 text-[10px] font-bold text-status-success">
                    <CheckCircle2 className="h-3 w-3" /> Tasdiqlangan
                  </span>
                </td>
                <td className="p-4">
                  <span className="rounded bg-surface-muted px-2 py-0.5 font-bold text-ink border border-border">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-bold text-status-success">
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-ink"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="OWNER">OWNER</option>
                    <option value="OWNER_STAFF">OWNER_STAFF</option>
                    <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

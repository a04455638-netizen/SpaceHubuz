import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";
import { isMaintenanceMode, setMaintenanceMode } from "@/server/admin/maintenance";

export async function GET() {
  return NextResponse.json({
    enabled: isMaintenanceMode(),
  });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  try {
    const { enabled } = await request.json();
    const boolVal = Boolean(enabled);
    setMaintenanceMode(boolVal);

    await logAuditEvent({
      userId: user.id,
      action: boolVal ? "MAINTENANCE_MODE_ENABLED" : "MAINTENANCE_MODE_DISABLED",
      resourceType: "System",
      resourceId: "global-maintenance",
      details: { enabled: boolVal },
    });

    const res = NextResponse.json({
      success: true,
      enabled: boolVal,
      message: boolVal
        ? "Texnik profilaktika rejimi yoqildi. Oddiy foydalanuvchilar ogohlantirish oynasini ko'radi."
        : "Texnik profilaktika rejimi o'chirildi. Sayt to'liq rejimda ishlamoqda.",
    });

    res.cookies.set("spacehub_maintenance", boolVal ? "true" : "false", {
      path: "/",
      maxAge: 31536000,
    });

    return res;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: "MAINTENANCE_UPDATE_FAILED", message: msg }, { status: 500 });
  }
}

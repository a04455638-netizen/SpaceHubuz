import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const logs = await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, phone: true } } },
      });

      await prisma.$disconnect();
      return NextResponse.json({ logs });
    } catch (e) {
      console.warn("DB audit logs query fallback:", e);
    }
  }

  return NextResponse.json({
    logs: [
      {
        id: "log-demo-1",
        action: "AUTH_LOGIN_SUCCESS",
        resourceType: "UserProfile",
        createdAt: new Date().toISOString(),
        details: JSON.stringify({ phone: "+998901234567" }),
        user: { fullName: "Aziz Karimov", phone: "+998901234567" },
      },
    ],
  });
}

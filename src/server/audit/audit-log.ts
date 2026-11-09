export interface AuditEventParams {
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Logs security and operational actions to the audit trail.
 * Safe against throws so caller operations are never disrupted.
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  const timestamp = new Date().toISOString();
  const serializedDetails =
    typeof params.details === "object" ? JSON.stringify(params.details) : params.details;

  // Print structured audit record to stdout for observability
  console.log(
    JSON.stringify({
      level: "AUDIT",
      timestamp,
      userId: params.userId || "anonymous",
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: serializedDetails,
      ip: params.ipAddress,
    })
  );

  // When database is connected, persist to AuditLog table
  try {
    if (process.env.DATABASE_URL) {
      // Dynamic import to avoid holding connection in offline unit tests
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      await prisma.auditLog.create({
        data: {
          userId: params.userId ?? null,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId ?? null,
          details: serializedDetails ?? null,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ?? null,
        },
      });
      await prisma.$disconnect();
    }
  } catch (error) {
    console.warn("AuditLog persistence non-fatal error:", error);
  }
}

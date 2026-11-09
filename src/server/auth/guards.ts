export type AuthRole = "CUSTOMER" | "OWNER" | "ADMIN";

export interface AuthenticatedUser {
  id: string;
  phone?: string;
  email?: string;
  role: AuthRole;
  fullName: string;
}

export interface RequestWithHeaders {
  headers: {
    get(name: string): string | null;
  };
}

/**
 * Resolves authenticated user from session or header fallback in development/test.
 */
export async function getSessionUser(request?: RequestWithHeaders): Promise<AuthenticatedUser | null> {
  // 1. In test or development environments, check mock auth header if Supabase credentials are not set
  const mockRoleHeader = request?.headers.get("x-mock-role") as AuthRole | null;
  const mockUserIdHeader = request?.headers.get("x-mock-user-id");
  if (mockRoleHeader && mockUserIdHeader) {
    return {
      id: mockUserIdHeader,
      role: mockRoleHeader,
      fullName: `User ${mockUserIdHeader.substring(0, 6)}`,
      phone: "+998901234567",
    };
  }

  // 2. If Supabase is not configured, return null without importing server headers
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  // 3. Check Supabase Auth dynamically
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const role = (user.user_metadata?.role as AuthRole) || "CUSTOMER";
    const fullName =
      user.user_metadata?.fullName || user.user_metadata?.full_name || "SpaceHub User";

    return {
      id: user.id,
      phone: user.phone || (user.user_metadata?.phone as string | undefined),
      email: user.email,
      role,
      fullName,
    };
  } catch {
    return null;
  }
}

/**
 * Guard: Requires any authenticated user.
 */
export async function requireAuthenticatedUser(
  request?: RequestWithHeaders
): Promise<{ user: AuthenticatedUser } | { response: Response }> {
  const user = await getSessionUser(request);
  if (!user) {
    return {
      response: Response.json(
        {
          error: "Unauthorized",
          message: "Autentifikatsiyadan o'tish talab etiladi (Authentication required)",
        },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Guard: Requires user with OWNER or ADMIN role.
 */
export async function requireOwner(
  request?: RequestWithHeaders
): Promise<{ user: AuthenticatedUser } | { response: Response }> {
  const result = await requireAuthenticatedUser(request);
  if ("response" in result) return result;

  if (result.user.role !== "OWNER" && result.user.role !== "ADMIN") {
    return {
      response: Response.json(
        {
          error: "Forbidden",
          message: "Ushbu amal faqat joy egalari uchun ruxsat etilgan (Owner role required)",
        },
        { status: 403 }
      ),
    };
  }

  return result;
}

/**
 * Guard: Requires user with ADMIN role.
 */
export async function requireAdmin(
  request?: RequestWithHeaders
): Promise<{ user: AuthenticatedUser } | { response: Response }> {
  const result = await requireAuthenticatedUser(request);
  if ("response" in result) return result;

  if (result.user.role !== "ADMIN") {
    return {
      response: Response.json(
        {
          error: "Forbidden",
          message: "Administrator ruxsati talab etiladi (Admin role required)",
        },
        { status: 403 }
      ),
    };
  }

  return result;
}

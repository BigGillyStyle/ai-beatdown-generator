import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Note: In Next.js 16, middleware was renamed to "proxy". This file uses the proxy convention.

export async function proxy(request: NextRequest) {
  let user: Awaited<ReturnType<typeof getSessionUser>>;
  try {
    user = await getSessionUser(request);
  } catch (error) {
    console.error("Proxy: unexpected error during session check:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const ADMIN_PATHS = ["/exercises", "/exicon", "/routine-templates", "/users"];
  const isAdminRoute = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!user) {
    return isApiRoute ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/", request.url));
  }

  if (user.approvalStatus !== "approved") {
    return isApiRoute ? NextResponse.json({ error: "Forbidden" }, { status: 403 }) : NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && user.role !== "admin") {
    return isApiRoute ? NextResponse.json({ error: "Forbidden" }, { status: 403 }) : NextResponse.redirect(new URL("/generate", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except public auth pages, auth API routes, and Next.js internals.
  // Any new route is automatically protected without updating this list.
  matcher: ["/((?!register|api/auth|_next/static|_next/image|favicon.ico).+)"],
};

async function getSessionUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;

  // Full DB lookup on every request — intentional so that session revocation
  // (deleting the session row) takes effect immediately, and to get the
  // current role/approvalStatus values rather than stale session data.
  const [user] = await getDb().select().from(users).where(eq(users.id, session.user.id)).limit(1);
  return user ?? null;
}

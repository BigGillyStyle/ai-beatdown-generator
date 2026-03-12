import { type NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SESSION_COOKIE_NAME } from "@/lib/session";

// Note: In Next.js 16, middleware was renamed to "proxy". This file uses the proxy convention.
// Proxy defaults to Node.js runtime (stable since v15.5), so firebase-admin works without
// additional configuration.

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
    return isApiRoute ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (user.approvalStatus !== "approved") {
    return isApiRoute ? NextResponse.json({ error: "Forbidden" }, { status: 403 }) : NextResponse.redirect(new URL("/pending", request.url));
  }

  if (isAdminRoute && user.role !== "admin") {
    return isApiRoute ? NextResponse.json({ error: "Forbidden" }, { status: 403 }) : NextResponse.redirect(new URL("/generate", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except public auth pages, auth API routes, and Next.js internals.
  // Any new route is automatically protected without updating this list.
  matcher: ["/((?!sign-in|register|pending|api/auth|_next/static|_next/image|favicon.ico).*)"],
};

async function getSessionUser(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
  } catch (error) {
    const code = (error as { code?: string }).code ?? "";
    if (code.startsWith("auth/")) return null;
    throw error; // infrastructure error: bubble to proxy's try/catch → 500
  }

  const [user] = await getDb().select().from(users).where(eq(users.firebaseUid, uid)).limit(1);
  return user ?? null;
}

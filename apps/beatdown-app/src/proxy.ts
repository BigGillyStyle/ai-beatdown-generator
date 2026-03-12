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
  const user = await getSessionUser(request);

  const { pathname } = request.nextUrl;
  const ADMIN_PATHS = ["/exercises", "/exicon", "/routine-templates", "/users"];
  const isAdminRoute = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isUserRoute = pathname === "/generate" || pathname.startsWith("/generate/");

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAdminRoute && user.role !== "admin") {
    return NextResponse.redirect(new URL("/generate", request.url));
  }

  if (isUserRoute && user.approvalStatus !== "approved") {
    return NextResponse.redirect(new URL("/pending", request.url));
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

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const [user] = await getDb().select().from(users).where(eq(users.firebaseUid, decoded.uid)).limit(1);
    return user ?? null;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

import { type NextRequest, NextResponse } from "next/server";

// TODO (Issue #11 — Firebase Auth + Admin Approval Gate): Wire this as middleware.
// This file will be re-exported from src/middleware.ts once auth is implemented.
// Protected routes: /(admin)/* requires admin role, /(user)/* requires any authenticated user.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/(admin)/:path*", "/(user)/:path*"],
};

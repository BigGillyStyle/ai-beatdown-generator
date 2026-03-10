import { type NextRequest, NextResponse } from "next/server";

// TODO (Story 3): Add Firebase auth token verification and role-based route protection.
// Protected routes: /(admin)/* requires admin role, /(user)/* requires any authenticated user.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/(admin)/:path*", "/(user)/:path*"],
};

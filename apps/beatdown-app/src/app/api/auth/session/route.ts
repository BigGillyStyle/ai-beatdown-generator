import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 60 * 60 * 24 * 14 * 1000; // 14 days

export async function POST(request: Request) {
  let idToken: string;
  try {
    const body = (await request.json()) as { idToken?: unknown };
    if (typeof body.idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }
    idToken = body.idToken;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let firebaseUid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    firebaseUid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);

  if (!user || user.approvalStatus !== "approved") {
    return NextResponse.json({ redirectTo: "/pending" }, { status: 200 });
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });

  const response = NextResponse.json({ redirectTo: "/generate" }, { status: 200 });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
  return response;
}

import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    email = body.email.toLowerCase().trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let firebaseUid: string;
  try {
    const userRecord = await getAdminAuth().createUser({ email });
    firebaseUid = userRecord.uid;
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error("Firebase createUser error:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  try {
    await getDb().insert(users).values({ firebaseUid, email });
  } catch (err) {
    // Roll back Firebase user if DB insert fails
    await getAdminAuth()
      .deleteUser(firebaseUid)
      .catch(() => undefined);
    // Unique constraint violation — email already in DB
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error("DB insert error:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

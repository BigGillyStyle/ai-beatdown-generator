import { NextResponse } from "next/server";
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

  try {
    await getDb().insert(users).values({ email });
  } catch (err) {
    // Unique constraint violation — email already registered
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error("DB insert error in /api/auth/register:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

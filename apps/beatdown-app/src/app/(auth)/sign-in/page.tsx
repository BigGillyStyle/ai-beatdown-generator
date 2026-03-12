"use client";

import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { EMAIL_LOCAL_STORAGE_KEY } from "./constants";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/sign-in/confirm`,
      handleCodeInApp: true,
    };

    try {
      const normalizedEmail = email.trim();
      await sendSignInLinkToEmail(getFirebaseAuth(), normalizedEmail, actionCodeSettings);
      window.localStorage.setItem(EMAIL_LOCAL_STORAGE_KEY, normalizedEmail);
      setEmail(normalizedEmail);
      setSent(true);
    } catch (err: unknown) {
      console.error("Failed to send sign-in link:", err);
      setError("Failed to send link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 px-4 text-center">
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your email and we&apos;ll send you a magic link.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send Magic Link"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have access?{" "}
          <a href="/register" className="underline hover:text-foreground">
            Request access
          </a>
        </p>
      </div>
    </main>
  );
}

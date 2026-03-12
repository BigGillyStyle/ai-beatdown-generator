"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";
import { EMAIL_LOCAL_STORAGE_KEY } from "../constants";
import type { Status } from "./types";

export default function SignInConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const completeSignIn = useCallback(
    async (email: string) => {
      setStatus("loading");
      try {
        const normalizedEmail = email.trim();
        if (!normalizedEmail) {
          setStatus("needs-email");
          return;
        }
        const result = await signInWithEmailLink(getFirebaseAuth(), normalizedEmail, window.location.href);
        window.localStorage.removeItem(EMAIL_LOCAL_STORAGE_KEY);
        const idToken = await result.user.getIdToken();

        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = (await response.json()) as { redirectTo?: string; error?: string };

        if (!response.ok) {
          setError(data.error ?? "Sign-in failed. Please try again.");
          setStatus("error");
          return;
        }

        setStatus("done");
        router.replace(data.redirectTo ?? "/generate");
      } catch (err: unknown) {
        console.error("Sign-in confirmation failed:", err);
        setError("Sign-in failed. Please try again.");
        setStatus("error");
      }
    },
    [router]
  );

  useEffect(() => {
    let auth;
    try {
      auth = getFirebaseAuth();
    } catch (err: unknown) {
      console.error("Failed to initialize Firebase auth:", err);
      setError("Sign-in is temporarily unavailable. Please try again.");
      setStatus("error");
      return;
    }
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      router.replace("/sign-in");
      return;
    }
    const stored = window.localStorage.getItem(EMAIL_LOCAL_STORAGE_KEY);
    if (!stored) {
      setStatus("needs-email");
    } else {
      void completeSignIn(stored);
    }
  }, [router, completeSignIn]);

  function handleEmailSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    void completeSignIn(emailInput);
  }

  if (status === "loading" || status === "done") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4 px-4 text-center">
          <h1 className="text-2xl font-bold">Sign-in failed</h1>
          <p className="text-sm text-destructive">{error}</p>
          <Link href="/sign-in" className="text-sm underline hover:text-foreground">
            Try again
          </Link>
        </div>
      </main>
    );
  }

  // needs-email: user opened link on a different device
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Confirm your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">It looks like you opened this link on a different device. Enter your email to complete sign-in.</p>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Complete Sign In
          </button>
        </form>
      </div>
    </main>
  );
}

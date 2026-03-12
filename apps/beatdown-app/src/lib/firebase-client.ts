import { initializeApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { env } from "@/lib/env";

// Lazy initialization: getAuth() validates the API key synchronously and throws on empty strings,
// so we cannot call it at module level — next build evaluates modules without env vars.
let _auth: Auth | undefined;

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  const app =
    getApps().length > 0
      ? getApps()[0]!
      : initializeApp({
          apiKey: env.nextPublicFirebaseApiKey,
          authDomain: env.nextPublicFirebaseAuthDomain,
          projectId: env.nextPublicFirebaseProjectId,
        });
  _auth = getAuth(app);
  return _auth;
}

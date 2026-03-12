import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "@/lib/env";

// Lazy initialization: cert() validates credentials synchronously and throws on empty strings,
// so we cannot call initializeApp() at module level — next build evaluates modules without env vars.
let _adminAuth: Auth | undefined;

export function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;
  const app =
    getApps().length > 0
      ? getApps()[0]!
      : initializeApp({
          credential: cert({
            projectId: env.firebaseAdminProjectId,
            clientEmail: env.firebaseAdminClientEmail,
            privateKey: env.firebaseAdminPrivateKey.replace(/\\n/g, "\n"),
          }),
        });
  _adminAuth = getAuth(app);
  return _adminAuth;
}

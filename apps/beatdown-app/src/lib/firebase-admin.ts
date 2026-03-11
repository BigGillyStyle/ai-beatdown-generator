import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "@/lib/env";

function initAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp({
    credential: cert({
      projectId: env.firebaseAdminProjectId,
      clientEmail: env.firebaseAdminClientEmail,
      privateKey: env.firebaseAdminPrivateKey.replace(/\\n/g, "\n"),
    }),
  });
}

const adminApp = initAdminApp();
export const adminAuth = getAuth(adminApp);

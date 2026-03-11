import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "@/lib/env";

function initClientApp() {
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp({
    apiKey: env.nextPublicFirebaseApiKey,
    authDomain: env.nextPublicFirebaseAuthDomain,
    projectId: env.nextPublicFirebaseProjectId,
  });
}

export const auth = getAuth(initClientApp());

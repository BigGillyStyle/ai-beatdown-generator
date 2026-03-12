function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get databaseUrl() {
    return requireEnv("DATABASE_URL");
  },

  nextPublicFirebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",

  nextPublicFirebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",

  nextPublicFirebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  firebaseAdminProjectId: process.env["FIREBASE_ADMIN_PROJECT_ID"] ?? "",
  firebaseAdminClientEmail: process.env["FIREBASE_ADMIN_CLIENT_EMAIL"] ?? "",
  firebaseAdminPrivateKey: process.env["FIREBASE_ADMIN_PRIVATE_KEY"] ?? "",
  resendApiKey: process.env["RESEND_API_KEY"] ?? "",
  anthropicApiKey: process.env["ANTHROPIC_API_KEY"] ?? "",
};

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

  get betterAuthSecret() {
    return requireEnv("BETTER_AUTH_SECRET");
  },

  get betterAuthUrl() {
    return requireEnv("BETTER_AUTH_URL");
  },

  resendApiKey: process.env["RESEND_API_KEY"] ?? "",
  anthropicApiKey: process.env["ANTHROPIC_API_KEY"] ?? "",
};

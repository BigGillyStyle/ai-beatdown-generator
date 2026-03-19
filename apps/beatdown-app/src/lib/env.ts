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

  get resendApiKey() {
    return requireEnv("RESEND_API_KEY");
  },

  get anthropicApiKey() {
    return requireEnv("ANTHROPIC_API_KEY");
  },
};

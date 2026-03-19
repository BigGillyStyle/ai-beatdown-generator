import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { getDb } from "@/db";
import { users, sessions, verifications } from "@/db/schema";
import { env } from "@/lib/env";

const resend = new Resend(env.resendApiKey);

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: env.betterAuthUrl,
  database: drizzleAdapter(getDb(), { provider: "pg", schema: { user: users, session: sessions, verification: verifications } }),
  session: { expiresIn: 60 * 60 * 24 * 60 }, // 60 days
  plugins: [
    magicLink({
      disableSignUp: true,
      expiresIn: 600, // 10 minutes
      sendMagicLink: async ({ email, url }) => {
        try {
          await resend.emails.send({
            from: "AI Beatdown Generator <onboarding@resend.dev>",
            to: email,
            subject: "Your sign-in link",
            html: `<p>Click <a href="${url}">here</a> to sign in. This link expires in 10 minutes.</p>`,
          });
        } catch (err) {
          console.error("Failed to send magic link email to", email, err);
          throw err;
        }
      },
    }),
    nextCookies(),
  ],
});

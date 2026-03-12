import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.resendApiKey);
const FROM = "AI Beatdown Generator <onboarding@resend.dev>";

// Resend v6: emails.send() returns { data, error } — always check error before assuming success.
// `to` must be an array.

export async function sendApprovalEmail(to: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Your AI Beatdown Generator access has been approved!",
    html: `<p>Great news! Your request to access the AI Beatdown Generator has been approved.</p>
           <p><a href="${process.env["NEXTAUTH_URL"] ?? "http://localhost:3000"}/sign-in">Sign in now</a></p>`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendRejectionEmail(to: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "AI Beatdown Generator access request update",
    html: `<p>Unfortunately, your request to access the AI Beatdown Generator has not been approved at this time.</p>`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

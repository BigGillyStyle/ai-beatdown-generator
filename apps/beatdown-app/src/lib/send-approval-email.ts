import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.resendApiKey);
const FROM = "AI Beatdown Generator <onboarding@resend.dev>";

export async function sendApprovalEmail(to: string): Promise<void> {
  console.log(`[sendApprovalEmail] Sending to: ${to}`);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Your AI Beatdown Generator access has been approved!",
    html: `<p>Great news! Your request to access the AI Beatdown Generator has been approved.</p>
           <p><a href="${env.appUrl}/sign-in">Sign in now</a></p>`,
  });
  if (error) {
    console.error(`[sendApprovalEmail] Failed for ${to}:`, error);
    throw new Error(`Resend error: ${error.message}`);
  }
  console.log(`[sendApprovalEmail] Successfully sent to: ${to}`);
}

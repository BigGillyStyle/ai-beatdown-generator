import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = new Resend(env.resendApiKey);
const FROM = "AI Beatdown Generator <onboarding@resend.dev>";

export async function sendRejectionEmail(to: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "AI Beatdown Generator access request update",
    html: `<p>Unfortunately, your request to access the AI Beatdown Generator has not been approved at this time.</p>`,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

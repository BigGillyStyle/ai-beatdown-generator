import { getDb } from "./index.js";
import { users } from "./schema.js";

const email = process.env["ADMIN_EMAIL"];
if (!email) throw new Error("ADMIN_EMAIL env var required");

await getDb().insert(users).values({ email, role: "admin", approvalStatus: "approved", emailVerified: true }).onConflictDoNothing();
console.log(`Admin user ${email} seeded.`);
process.exit(0);

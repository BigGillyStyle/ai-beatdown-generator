import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// postgres is lazy — it doesn't connect until the first query.
// Throwing at module level breaks `next build` which evaluates modules without runtime env vars.
// Connection errors surface naturally at query time if DATABASE_URL is absent at runtime.
const queryClient = postgres(process.env["DATABASE_URL"]!);
export const db = drizzle({ client: queryClient, schema });

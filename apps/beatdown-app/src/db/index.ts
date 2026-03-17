import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "@/lib/env";

// Lazy initialization: defers neon() until first query so next build succeeds
// without DATABASE_URL. Missing DATABASE_URL surfaces via env.databaseUrl at query time.
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    _db = drizzle(neon(env.databaseUrl), { schema });
  }
  return _db;
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

// Lazy initialization: defers postgres() until first query so next build succeeds
// without DATABASE_URL. Missing DATABASE_URL surfaces via env.databaseUrl at query time.
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    _db = drizzle({ client: postgres(env.databaseUrl), schema });
  }
  return _db;
}

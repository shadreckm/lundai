import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle<typeof schema>>;

export function getDb() {
  if (!db) {
    if (!connectionString) {
      console.warn("⚠️  DATABASE_URL not set – running without database (mock mode)");
      // Return a proxy that logs instead of querying
      return null;
    }
    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
    db = drizzle(pool, { schema });
  }
  return db;
}

export { schema };
export default getDb;

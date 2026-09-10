import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { users } from "./schema/users";

type Schema = { users: typeof users };

const globalForDb = globalThis as unknown as {
  __antruaDb?: BetterSQLite3Database<Schema>;
};

function createDb() {
  const path = process.env.ANTRUA_SQLITE_PATH;
  if (!path) throw new Error("ANTRUA_SQLITE_PATH is required");
  const sqlite = new Database(path);
  return drizzle(sqlite, { schema: { users } });
}

export const db: BetterSQLite3Database<Schema> =
  globalForDb.__antruaDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__antruaDb = db;
}

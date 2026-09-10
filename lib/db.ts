import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema/users";

const path = process.env.ANTRUA_SQLITE_PATH;
if (!path) throw new Error("ANTRUA_SQLITE_PATH is required");

const sqlite = new Database(path);
export const db = drizzle(sqlite, { schema: { users: schema.users } });

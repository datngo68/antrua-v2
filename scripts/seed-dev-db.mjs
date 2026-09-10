import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const dbPath = resolve(process.env.ANTRUA_SQLITE_PATH ?? "./data/antrua.dev.db");
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Username TEXT,
    PasswordHash TEXT,
    Role TEXT NOT NULL DEFAULT 'User',
    GroupId INTEGER,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
  );
`);

const existing = db
  .prepare("SELECT Id FROM Users WHERE Username = ?")
  .get("ngotiendat");

if (!existing) {
  const hash = bcrypt.hashSync("123456", 12);
  db.prepare(
    `INSERT INTO Users (Name, Username, PasswordHash, Role, GroupId, IsActive, CreatedAt)
     VALUES (?, ?, ?, ?, NULL, 1, ?)`,
  ).run("Ngo Tien Dat", "ngotiendat", hash, "SuperAdmin", new Date().toISOString());
  console.log("Seeded user ngotiendat / 123456");
} else {
  console.log("User ngotiendat already exists");
}

const row = db.prepare("SELECT Id, Username, Role FROM Users WHERE Username = ?").get("ngotiendat");
console.log("Smoke:", row);
db.close();

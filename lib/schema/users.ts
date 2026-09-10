import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  id: integer("Id").primaryKey({ autoIncrement: true }),
  name: text("Name").notNull(),
  username: text("Username"),
  passwordHash: text("PasswordHash"),
  role: text("Role").notNull().default("User"),
  groupId: integer("GroupId"),
  isActive: integer("IsActive", { mode: "boolean" }).notNull().default(true),
  createdAt: text("CreatedAt").notNull(),
});

export type User = typeof users.$inferSelect;

import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { hashPassword, verifyPassword } from "../lib/password";

describe("verifyPassword", () => {
  it("accepts bcrypt hash", async () => {
    const hash = await hashPassword("123456");
    expect(await verifyPassword("123456", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("accepts legacy MD5 hex 32", async () => {
    const md5 = createHash("md5").update("123456", "utf8").digest("hex");
    expect(md5).toHaveLength(32);
    expect(await verifyPassword("123456", md5)).toBe(true);
    expect(await verifyPassword("nope", md5)).toBe(false);
  });

  it("rejects null/empty hash", async () => {
    expect(await verifyPassword("123456", null)).toBe(false);
    expect(await verifyPassword("123456", "")).toBe(false);
  });
});

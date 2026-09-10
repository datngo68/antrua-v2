import { describe, it, expect, afterEach } from "vitest";
import { getSessionOptions } from "../lib/session-options";

describe("getSessionOptions password gate", () => {
  const prev = process.env.SESSION_PASSWORD;

  afterEach(() => {
    if (prev === undefined) delete process.env.SESSION_PASSWORD;
    else process.env.SESSION_PASSWORD = prev;
  });

  it("rejects missing or short SESSION_PASSWORD", () => {
    delete process.env.SESSION_PASSWORD;
    expect(() => getSessionOptions()).toThrow(/SESSION_PASSWORD/);

    process.env.SESSION_PASSWORD = "too-short";
    expect(() => getSessionOptions()).toThrow(/32/);
  });

  it("accepts password length >= 32", () => {
    process.env.SESSION_PASSWORD =
      "complex_password_at_least_32_characters_long";
    const opts = getSessionOptions();
    expect(opts.password.length).toBeGreaterThanOrEqual(32);
    expect(opts.cookieName).toBe(".AnTrua.Session");
  });
});

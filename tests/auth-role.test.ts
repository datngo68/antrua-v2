import { describe, it, expect } from "vitest";
import { canManageGroup } from "../lib/roles";

describe("canManageGroup", () => {
  it("allows Admin and SuperAdmin", () => {
    expect(canManageGroup("Admin")).toBe(true);
    expect(canManageGroup("SuperAdmin")).toBe(true);
  });

  it("denies User and unknown", () => {
    expect(canManageGroup("User")).toBe(false);
    expect(canManageGroup("")).toBe(false);
  });
});

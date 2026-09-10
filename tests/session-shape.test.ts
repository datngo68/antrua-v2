import { describe, it, expect } from "vitest";
import { toSessionFields } from "../lib/auth";

describe("toSessionFields", () => {
  it("maps Users row to session shape", () => {
    expect(
      toSessionFields({
        id: 1,
        username: "ngotiendat",
        name: "Ngo Tien Dat",
        role: "SuperAdmin",
        groupId: null,
      }),
    ).toEqual({
      userId: 1,
      username: "ngotiendat",
      fullName: "Ngo Tien Dat",
      role: "SuperAdmin",
      groupId: null,
    });
  });
});

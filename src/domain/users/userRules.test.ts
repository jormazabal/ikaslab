import { describe, expect, it } from "vitest";
import { createUserEntity, normalizeUserName, validateUserInput } from "./userRules";

describe("user rules", () => {
  it("normalizes names", () => {
    expect(normalizeUserName("  Ane   Panda ")).toBe("Ane Panda");
  });

  it("validates user input", () => {
    expect(validateUserInput({ name: "A", avatarId: "" })).toHaveLength(2);
  });

  it("creates a valid user entity", () => {
    const user = createUserEntity(
      { name: "  Leo  ", avatarId: "panda-ninja" },
      "user-1",
      "2026-01-01T00:00:00Z",
    );

    expect(user).toMatchObject({
      id: "user-1",
      name: "Leo",
      totalPoints: 0,
    });
  });
});

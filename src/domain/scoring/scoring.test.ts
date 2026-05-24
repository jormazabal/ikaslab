import { describe, expect, it } from "vitest";
import { scoreAnswer } from "./scoring";

describe("scoreAnswer", () => {
  it("scores correct answers without hints", () => {
    expect(scoreAnswer(true, false)).toBe(3);
  });

  it("scores correct answers with hints", () => {
    expect(scoreAnswer(true, true)).toBe(1);
  });

  it("scores wrong answers", () => {
    expect(scoreAnswer(false, false)).toBe(-1);
  });
});

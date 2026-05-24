import { describe, expect, it } from "vitest";
import { initialVocabularyPack } from "../data/initialVocabulary";
import { buildHintOptions, checkAnswer, isCorrectAnswer, selectTermsForBlocks } from "./gameLogic";

const airline = initialVocabularyPack.terms.find((term) => term.word === "airline")!;

describe("english vocabulary game logic", () => {
  it("validates answer ignoring case and surrounding spaces", () => {
    expect(isCorrectAnswer(" AIRLINE ", airline)).toBe(true);
  });

  it("keeps model ready for accepted answers", () => {
    expect(isCorrectAnswer("air company", { ...airline, acceptedAnswers: ["air company"] })).toBe(true);
  });

  it("checks answer and applies scoring", () => {
    expect(checkAnswer("airline", airline, false)).toMatchObject({ isCorrect: true, points: 3 });
    expect(checkAnswer("delay", airline, true)).toMatchObject({ isCorrect: false, points: -1 });
  });

  it("selects terms by selected blocks", () => {
    const terms = selectTermsForBlocks(initialVocabularyPack.terms, ["module-1"]);
    expect(terms).toHaveLength(54);
    expect(terms.every((term) => term.blockId === "module-1")).toBe(true);
  });

  it("generates hint with five unique options including the answer", () => {
    const options = buildHintOptions(airline, initialVocabularyPack.terms);
    expect(options).toHaveLength(5);
    expect(new Set(options).size).toBe(5);
    expect(options).toContain("airline");
  });
});

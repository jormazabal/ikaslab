import { describe, expect, it } from "vitest";
import { initialVocabularyPack } from "./initialVocabulary";

describe("initial vocabulary from document", () => {
  it("uses the six document modules as blocks", () => {
    expect(initialVocabularyPack.blocks.map((block) => block.id)).toEqual([
      "module-1",
      "module-2",
      "module-3",
      "module-4",
      "module-5",
      "module-6",
    ]);
  });

  it("contains only English terms from the document vocabulary list", () => {
    expect(initialVocabularyPack.terms).toHaveLength(312);
    expect(initialVocabularyPack.terms[0]).toMatchObject({
      blockId: "module-1",
      word: "airline",
      translation: null,
    });
  });
});

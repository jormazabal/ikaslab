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
      wordTranslation: "aerolínea",
      translation: "La ___ perdió nuestra maleta después del vuelo.",
    });
  });

  it("stores Spanish translations for every word option and example sentence", () => {
    for (const term of initialVocabularyPack.terms) {
      expect(term.wordTranslation?.trim()).toBeTruthy();
      expect(term.translation?.trim()).toBeTruthy();
      expect(term.translation).toContain("___");
    }
  });

  it("stores contextual example sentences with one missing word placeholder", () => {
    for (const term of initialVocabularyPack.terms) {
      expect(term.sentence).toContain("___");
      expect(term.sentence).not.toContain("Complete this vocabulary");
      expect(term.sentence.match(/___/g)).toHaveLength(1);
    }
  });
});

import { initialVocabularyPack } from "../../modules/english-vocabulary/data/initialVocabulary";
import type {
  VocabularyBlock,
  VocabularyPack,
  VocabularyTerm,
} from "../../modules/english-vocabulary/domain/types";
import { vocabularyPackSchema } from "../../modules/english-vocabulary/domain/vocabularySchemas";
import { appRepository } from "../persistence/appRepository";

const previousDefaultBlockIds = new Set(["animals", "food", "school", "house", "clothes", "actions"]);

export interface VocabularyContentSnapshot extends VocabularyPack {
  blockCounts: Record<string, number>;
}

export function validateVocabularyPack(data: unknown): VocabularyPack {
  return vocabularyPackSchema.parse(data);
}

export const vocabularyContentService = {
  async ensureInitialContent(): Promise<void> {
    const current = await appRepository.getVocabularyPack();
    if (current.blocks.length === 0 || current.terms.length === 0 || usesPreviousDefaultVocabulary(current)) {
      await appRepository.replaceVocabulary(initialVocabularyPack);
    }
  },

  async getSnapshot(): Promise<VocabularyContentSnapshot> {
    const pack = await appRepository.getVocabularyPack();
    const blockCounts = pack.terms.reduce<Record<string, number>>((counts, term) => {
      if (term.enabled) {
        counts[term.blockId] = (counts[term.blockId] ?? 0) + 1;
      }
      return counts;
    }, {});

    return { ...pack, blockCounts };
  },

  async saveBlock(block: VocabularyBlock): Promise<void> {
    await appRepository.upsertBlock(block);
  },

  async deleteBlock(blockId: string): Promise<void> {
    await appRepository.deleteBlock(blockId);
  },

  async saveTerm(term: VocabularyTerm): Promise<void> {
    await appRepository.upsertTerm(term);
  },

  async deleteTerm(termId: string): Promise<void> {
    await appRepository.deleteTerm(termId);
  },

  async importPack(data: unknown): Promise<void> {
    await appRepository.replaceVocabulary(validateVocabularyPack(data));
  },

  async exportPack(): Promise<VocabularyPack> {
    const pack = await appRepository.getVocabularyPack();
    return {
      ...pack,
      exportedAt: new Date().toISOString(),
    };
  },

  async restoreInitial(): Promise<void> {
    await appRepository.replaceVocabulary(initialVocabularyPack);
  },
};

function usesPreviousDefaultVocabulary(pack: VocabularyPack): boolean {
  const currentBlockIds = new Set(pack.blocks.map((block) => block.id));
  return (
    pack.blocks.length === previousDefaultBlockIds.size &&
    Array.from(previousDefaultBlockIds).every((blockId) => currentBlockIds.has(blockId))
  );
}

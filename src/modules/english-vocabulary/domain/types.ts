export type Difficulty = "easy" | "medium" | "hard";

export interface VocabularyBlock {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  orderIndex: number;
  enabled: boolean;
}

export interface VocabularyTerm {
  id: string;
  blockId: string;
  word: string;
  sentence: string;
  translation?: string | null;
  hint?: string | null;
  difficulty: Difficulty;
  distractors: string[];
  enabled: boolean;
  acceptedAnswers?: string[];
}

export interface VocabularyPack {
  schemaVersion: 1;
  moduleId: "english-vocabulary";
  exportedAt?: string;
  blocks: VocabularyBlock[];
  terms: VocabularyTerm[];
}

import { scoreAnswer } from "../../../domain/scoring/scoring";
import type { VocabularyTerm } from "./types";

export interface AnswerCheckResult {
  isCorrect: boolean;
  points: number;
  normalizedAnswer: string;
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLocaleLowerCase("en-US");
}

export function isCorrectAnswer(answer: string, term: VocabularyTerm): boolean {
  const normalized = normalizeAnswer(answer);
  const accepted = [term.word, ...(term.acceptedAnswers ?? [])].map(normalizeAnswer);
  return accepted.includes(normalized);
}

export function checkAnswer(answer: string, term: VocabularyTerm, hintUsed: boolean): AnswerCheckResult {
  const isCorrect = isCorrectAnswer(answer, term);
  return {
    isCorrect,
    points: scoreAnswer(isCorrect, hintUsed),
    normalizedAnswer: normalizeAnswer(answer),
  };
}

export function selectTermsForBlocks(terms: VocabularyTerm[], selectedBlockIds: string[]): VocabularyTerm[] {
  const selected = new Set(selectedBlockIds);
  return terms.filter((term) => term.enabled && selected.has(term.blockId));
}

export function buildHintOptions(term: VocabularyTerm, allTerms: VocabularyTerm[], optionCount = 5): string[] {
  const normalizedCorrect = normalizeAnswer(term.word);
  const candidates = [
    ...term.distractors,
    ...allTerms.filter((candidate) => candidate.id !== term.id).map((candidate) => candidate.word),
  ];
  const uniqueDistractors = Array.from(
    new Map(
      candidates
        .filter((candidate) => normalizeAnswer(candidate) !== normalizedCorrect)
        .map((candidate) => [normalizeAnswer(candidate), candidate]),
    ).values(),
  );

  const selected = uniqueDistractors.slice(0, Math.max(0, optionCount - 1));
  const withCorrect = [term.word, ...selected].slice(0, optionCount);

  return stableShuffle(withCorrect, term.id);
}

export function stableShuffle<T>(items: T[], seed: string): T[] {
  const result = [...items];
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  for (let index = result.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const swapIndex = Math.abs(hash) % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

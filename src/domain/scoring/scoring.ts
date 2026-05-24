export type AnswerOutcome = "correct-no-hint" | "correct-with-hint" | "wrong";

export const SCORE_RULES: Record<AnswerOutcome, number> = {
  "correct-no-hint": 3,
  "correct-with-hint": 1,
  wrong: -1,
};

export function scoreAnswer(isCorrect: boolean, hintUsed: boolean): number {
  if (!isCorrect) {
    return SCORE_RULES.wrong;
  }

  return hintUsed ? SCORE_RULES["correct-with-hint"] : SCORE_RULES["correct-no-hint"];
}

export interface GameSession {
  id: string;
  userId: string;
  moduleId: string;
  startedAt: string;
  endedAt: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  hintsUsed: number;
  selectedBlocks: string[];
  totalQuestions: number;
  data: Record<string, unknown>;
}

export type SaveGameSessionInput = Omit<GameSession, "id">;

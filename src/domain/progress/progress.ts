import type { GameSession } from "../sessions/types";
import type { ModuleProgress } from "../modules/types";

export function applySessionToProgress(
  existing: ModuleProgress | undefined,
  session: GameSession,
): ModuleProgress {
  const previous = existing ?? {
    userId: session.userId,
    moduleId: session.moduleId,
    points: 0,
    bestScore: 0,
    sessionsCount: 0,
    lastPlayedAt: null,
    data: {},
  };

  return {
    ...previous,
    points: previous.points + session.score,
    bestScore: Math.max(previous.bestScore, session.score),
    sessionsCount: previous.sessionsCount + 1,
    lastPlayedAt: session.endedAt,
    data: {
      ...previous.data,
      lastSelectedBlocks: session.selectedBlocks,
      lastCorrectCount: session.correctCount,
      lastTotalQuestions: session.totalQuestions,
    },
  };
}

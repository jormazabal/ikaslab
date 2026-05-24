import { describe, expect, it } from "vitest";
import { applySessionToProgress } from "./progress";

describe("applySessionToProgress", () => {
  it("accumulates points and sessions", () => {
    const progress = applySessionToProgress(undefined, {
      id: "session-1",
      userId: "user-1",
      moduleId: "english-vocabulary",
      startedAt: "2026-01-01T00:00:00Z",
      endedAt: "2026-01-01T00:10:00Z",
      score: 7,
      correctCount: 3,
      wrongCount: 1,
      hintsUsed: 1,
      selectedBlocks: ["module-1"],
      totalQuestions: 4,
      data: {},
    });

    expect(progress.points).toBe(7);
    expect(progress.sessionsCount).toBe(1);
    expect(progress.bestScore).toBe(7);
  });
});

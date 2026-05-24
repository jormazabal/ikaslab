import { describe, expect, it } from "vitest";
import { localFallbackStore } from "./localFallbackStore";

describe("local fallback repository", () => {
  it("creates users and saves sessions with accumulated points", async () => {
    await localFallbackStore.bootstrap();
    const user = await localFallbackStore.createUser({
      name: "Ane",
      avatarId: "panda-student",
    });

    await localFallbackStore.saveSession({
      userId: user.id,
      moduleId: "english-vocabulary",
      startedAt: "2026-01-01T00:00:00Z",
      endedAt: "2026-01-01T00:05:00Z",
      score: 5,
      correctCount: 2,
      wrongCount: 1,
      hintsUsed: 1,
      selectedBlocks: ["module-1"],
      totalQuestions: 3,
      data: {},
    });

    const users = await localFallbackStore.listUsers();
    const progress = await localFallbackStore.listProgress(user.id);
    const sessions = await localFallbackStore.listSessions(user.id, "english-vocabulary");

    expect(users[0].totalPoints).toBe(5);
    expect(progress[0].points).toBe(5);
    expect(progress[0].sessionsCount).toBe(1);
    expect(sessions).toHaveLength(1);
  });
});

import { nanoid } from "nanoid";
import type { ModuleProgress } from "../../domain/modules/types";
import type { GameSession, SaveGameSessionInput } from "../../domain/sessions/types";
import type { CreateUserInput, User } from "../../domain/users/types";
import { createUserEntity } from "../../domain/users/userRules";
import { initialVocabularyPack } from "../../modules/english-vocabulary/data/initialVocabulary";
import type {
  VocabularyBlock,
  VocabularyPack,
  VocabularyTerm,
} from "../../modules/english-vocabulary/domain/types";

interface LocalState {
  users: User[];
  progress: ModuleProgress[];
  sessions: GameSession[];
  vocabulary: VocabularyPack;
}

const STORAGE_KEY = "ikaslab-local-dev-state";

function loadState(): LocalState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      users: [],
      progress: [],
      sessions: [],
      vocabulary: initialVocabularyPack,
    };
  }

  return JSON.parse(raw) as LocalState;
}

function saveState(state: LocalState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const localFallbackStore = {
  async bootstrap(): Promise<void> {
    const state = loadState();
    if (state.vocabulary.terms.length === 0) {
      state.vocabulary = initialVocabularyPack;
      saveState(state);
    }
  },

  async listUsers(): Promise<User[]> {
    return loadState().users;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const state = loadState();
    const user = createUserEntity(input, nanoid(), new Date().toISOString());
    state.users.push(user);
    saveState(state);
    return user;
  },

  async touchUser(userId: string): Promise<User | null> {
    const state = loadState();
    const user = state.users.find((item) => item.id === userId);
    if (!user) return null;
    user.lastUsedAt = new Date().toISOString();
    user.updatedAt = user.lastUsedAt;
    saveState(state);
    return user;
  },

  async listProgress(userId: string): Promise<ModuleProgress[]> {
    return loadState().progress.filter((item) => item.userId === userId);
  },

  async listSessions(userId: string, moduleId?: string): Promise<GameSession[]> {
    return loadState().sessions.filter(
      (item) => item.userId === userId && (!moduleId || item.moduleId === moduleId),
    );
  },

  async saveSession(input: SaveGameSessionInput): Promise<GameSession> {
    const state = loadState();
    const session: GameSession = { ...input, id: nanoid() };
    state.sessions.push(session);

    const existing = state.progress.find(
      (item) => item.userId === session.userId && item.moduleId === session.moduleId,
    );

    if (existing) {
      existing.points += session.score;
      existing.bestScore = Math.max(existing.bestScore, session.score);
      existing.sessionsCount += 1;
      existing.lastPlayedAt = session.endedAt;
      existing.data = {
        ...existing.data,
        lastSelectedBlocks: session.selectedBlocks,
      };
    } else {
      state.progress.push({
        userId: session.userId,
        moduleId: session.moduleId,
        points: session.score,
        bestScore: session.score,
        sessionsCount: 1,
        lastPlayedAt: session.endedAt,
        data: { lastSelectedBlocks: session.selectedBlocks },
      });
    }

    const user = state.users.find((item) => item.id === session.userId);
    if (user) {
      user.totalPoints += session.score;
      user.updatedAt = session.endedAt;
    }

    saveState(state);
    return session;
  },

  async getVocabularyPack(): Promise<VocabularyPack> {
    return loadState().vocabulary;
  },

  async replaceVocabulary(pack: VocabularyPack): Promise<void> {
    const state = loadState();
    state.vocabulary = pack;
    saveState(state);
  },

  async resetVocabulary(): Promise<void> {
    await this.replaceVocabulary(initialVocabularyPack);
  },

  async upsertBlock(block: VocabularyBlock): Promise<void> {
    const state = loadState();
    state.vocabulary.blocks = [
      ...state.vocabulary.blocks.filter((item) => item.id !== block.id),
      block,
    ].sort((a, b) => a.orderIndex - b.orderIndex);
    saveState(state);
  },

  async deleteBlock(blockId: string): Promise<void> {
    const state = loadState();
    state.vocabulary.blocks = state.vocabulary.blocks.filter((item) => item.id !== blockId);
    state.vocabulary.terms = state.vocabulary.terms.filter((item) => item.blockId !== blockId);
    saveState(state);
  },

  async upsertTerm(term: VocabularyTerm): Promise<void> {
    const state = loadState();
    state.vocabulary.terms = [
      ...state.vocabulary.terms.filter((item) => item.id !== term.id),
      term,
    ];
    saveState(state);
  },

  async deleteTerm(termId: string): Promise<void> {
    const state = loadState();
    state.vocabulary.terms = state.vocabulary.terms.filter((item) => item.id !== termId);
    saveState(state);
  },
};

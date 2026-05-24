import type { ModuleProgress } from "../../domain/modules/types";
import type { GameSession, SaveGameSessionInput } from "../../domain/sessions/types";
import type { CreateUserInput, User } from "../../domain/users/types";
import type {
  VocabularyBlock,
  VocabularyPack,
  VocabularyTerm,
} from "../../modules/english-vocabulary/domain/types";
import { localFallbackStore } from "./localFallbackStore";
import { invokeCommand, isTauriRuntime } from "./tauriClient";

export const appRepository = {
  async bootstrap(): Promise<void> {
    if (isTauriRuntime()) {
      await invokeCommand("bootstrap_app");
      return;
    }

    await localFallbackStore.bootstrap();
  },

  async listUsers(): Promise<User[]> {
    return isTauriRuntime() ? invokeCommand("list_users") : localFallbackStore.listUsers();
  },

  async createUser(input: CreateUserInput): Promise<User> {
    return isTauriRuntime()
      ? invokeCommand("create_user", { input })
      : localFallbackStore.createUser(input);
  },

  async touchUser(userId: string): Promise<User | null> {
    return isTauriRuntime()
      ? invokeCommand("touch_user", { userId })
      : localFallbackStore.touchUser(userId);
  },

  async listProgress(userId: string): Promise<ModuleProgress[]> {
    return isTauriRuntime()
      ? invokeCommand("list_module_progress", { userId })
      : localFallbackStore.listProgress(userId);
  },

  async listSessions(userId: string, moduleId?: string): Promise<GameSession[]> {
    return isTauriRuntime()
      ? invokeCommand("list_game_sessions", { userId, moduleId })
      : localFallbackStore.listSessions(userId, moduleId);
  },

  async saveSession(input: SaveGameSessionInput): Promise<GameSession> {
    return isTauriRuntime()
      ? invokeCommand("save_game_session", { input })
      : localFallbackStore.saveSession(input);
  },

  async getVocabularyPack(): Promise<VocabularyPack> {
    return isTauriRuntime()
      ? invokeCommand("get_vocabulary_pack")
      : localFallbackStore.getVocabularyPack();
  },

  async replaceVocabulary(pack: VocabularyPack): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("replace_vocabulary", { pack })
      : localFallbackStore.replaceVocabulary(pack);
  },

  async resetVocabulary(): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("reset_vocabulary")
      : localFallbackStore.resetVocabulary();
  },

  async upsertBlock(block: VocabularyBlock): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("upsert_vocabulary_block", { block })
      : localFallbackStore.upsertBlock(block);
  },

  async deleteBlock(blockId: string): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("delete_vocabulary_block", { blockId })
      : localFallbackStore.deleteBlock(blockId);
  },

  async upsertTerm(term: VocabularyTerm): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("upsert_vocabulary_term", { term })
      : localFallbackStore.upsertTerm(term);
  },

  async deleteTerm(termId: string): Promise<void> {
    return isTauriRuntime()
      ? invokeCommand("delete_vocabulary_term", { termId })
      : localFallbackStore.deleteTerm(termId);
  },
};

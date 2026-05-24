import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ModuleProgress } from "../../domain/modules/types";
import type { CreateUserInput, User } from "../../domain/users/types";
import { vocabularyContentService } from "../../services/content/vocabularyContentService";
import { appRepository } from "../../services/persistence/appRepository";

interface AppDataContextValue {
  users: User[];
  currentUser: User | null;
  progress: ModuleProgress[];
  loading: boolean;
  createUser: (input: CreateUserInput) => Promise<User>;
  selectUser: (userId: string) => Promise<void>;
  clearCurrentUser: () => void;
  refresh: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);
const SELECTED_USER_KEY = "ikaslab-selected-user-id";

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    const selectedId = localStorage.getItem(SELECTED_USER_KEY);
    if (!selectedId) {
      setProgress([]);
      return;
    }

    setProgress(await appRepository.listProgress(selectedId));
  }, []);

  const refresh = useCallback(async () => {
    const loadedUsers = await appRepository.listUsers();
    setUsers(loadedUsers);

    const selectedId = localStorage.getItem(SELECTED_USER_KEY);
    const selected = loadedUsers.find((user) => user.id === selectedId) ?? null;
    setCurrentUser(selected);
    setProgress(selected ? await appRepository.listProgress(selected.id) : []);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      await appRepository.bootstrap();
      await vocabularyContentService.ensureInitialContent();
      if (!cancelled) {
        await refresh();
        setLoading(false);
      }
    }

    void load().catch((error) => {
      console.error(error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const createUser = useCallback(
    async (input: CreateUserInput) => {
      const user = await appRepository.createUser(input);
      localStorage.setItem(SELECTED_USER_KEY, user.id);
      await refresh();
      return user;
    },
    [refresh],
  );

  const selectUser = useCallback(
    async (userId: string) => {
      await appRepository.touchUser(userId);
      localStorage.setItem(SELECTED_USER_KEY, userId);
      await refresh();
    },
    [refresh],
  );

  const clearCurrentUser = useCallback(() => {
    localStorage.removeItem(SELECTED_USER_KEY);
    setCurrentUser(null);
    setProgress([]);
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      progress,
      loading,
      createUser,
      selectUser,
      clearCurrentUser,
      refresh,
      refreshProgress,
    }),
    [
      users,
      currentUser,
      progress,
      loading,
      createUser,
      selectUser,
      clearCurrentUser,
      refresh,
      refreshProgress,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
}

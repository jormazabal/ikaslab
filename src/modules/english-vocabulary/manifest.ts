import type { EducationalModuleManifest } from "../../domain/modules/types";
import { VocabularyModule } from "./VocabularyModule";
import { VocabularySettings } from "./VocabularySettings";

export const englishVocabularyManifest: EducationalModuleManifest = {
  id: "english-vocabulary",
  title: "Vocabulario de inglés",
  shortDescription: "Completa frases con vocabulario básico en inglés.",
  longDescription:
    "Elige bloques temáticos, responde frases con huecos, usa pistas cuando lo necesites y acumula puntos en tu perfil.",
  category: "Idiomas",
  route: "/modules/english-vocabulary",
  icon: "📚",
  status: "active",
  version: "0.1.0",
  storageNamespace: "modules.englishVocabulary",
  component: VocabularyModule,
  settingsComponent: VocabularySettings,
  getInitialProgress: (userId) => ({
    userId,
    moduleId: "english-vocabulary",
    points: 0,
    bestScore: 0,
    sessionsCount: 0,
    lastPlayedAt: null,
    data: {},
  }),
  getDashboardSummary: (progress) => [
    {
      label: "Puntos",
      value: String(progress?.points ?? 0),
      tone: "success",
    },
    {
      label: "Partidas",
      value: String(progress?.sessionsCount ?? 0),
      tone: "neutral",
    },
  ],
};

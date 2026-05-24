import type { Avatar } from "./types";

export const avatarCatalog: Avatar[] = [
  {
    id: "panda-ninja",
    name: "Panda ninja",
    emoji: "🥷",
    color: "from-slate-700 to-slate-500",
    description: "Sigiloso y rápido.",
  },
  {
    id: "panda-student",
    name: "Panda estudiante",
    emoji: "🎒",
    color: "from-sky-400 to-cyan-300",
    description: "Siempre preparado.",
  },
  {
    id: "panda-astronaut",
    name: "Panda astronauta",
    emoji: "🚀",
    color: "from-indigo-500 to-sky-400",
    description: "Explora nuevas palabras.",
  },
  {
    id: "panda-samurai",
    name: "Panda samurái",
    emoji: "⚔️",
    color: "from-red-400 to-orange-300",
    description: "Concentración total.",
  },
  {
    id: "panda-mage",
    name: "Panda maga",
    emoji: "🪄",
    color: "from-fuchsia-400 to-pink-300",
    description: "Aprende con magia.",
  },
  {
    id: "panda-footballer",
    name: "Panda futbolista",
    emoji: "⚽",
    color: "from-emerald-400 to-lime-300",
    description: "Juega en equipo.",
  },
  {
    id: "panda-explorer",
    name: "Panda exploradora",
    emoji: "🧭",
    color: "from-amber-400 to-yellow-300",
    description: "Descubre retos.",
  },
  {
    id: "panda-robot",
    name: "Panda robot",
    emoji: "🤖",
    color: "from-zinc-400 to-teal-300",
    description: "Precisión brillante.",
  },
];

export function getAvatarById(id: string): Avatar | undefined {
  return avatarCatalog.find((avatar) => avatar.id === id);
}

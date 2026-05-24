import type { Avatar } from "./types";
import arcaneUrl from "../../shared/assets/avatars/teen/arcane.webp";
import analystUrl from "../../shared/assets/avatars/teen/analyst.webp";
import cyberUrl from "../../shared/assets/avatars/teen/cyber.webp";
import explorerUrl from "../../shared/assets/avatars/teen/explorer.webp";
import kendoUrl from "../../shared/assets/avatars/teen/kendo.webp";
import orbitUrl from "../../shared/assets/avatars/teen/orbit.webp";
import strikerUrl from "../../shared/assets/avatars/teen/striker.webp";
import techNoirUrl from "../../shared/assets/avatars/teen/tech-noir.webp";

export const avatarCatalog: Avatar[] = [
  {
    id: "panda-ninja",
    name: "Tech noir",
    color: "from-slate-900 to-cyan-800",
    imageUrl: techNoirUrl,
    description: "Concentración discreta y mentalidad estratégica.",
  },
  {
    id: "panda-student",
    name: "Analista",
    color: "from-blue-900 to-slate-500",
    imageUrl: analystUrl,
    description: "Ordenado, preciso y constante.",
  },
  {
    id: "panda-astronaut",
    name: "Órbita",
    color: "from-indigo-900 to-blue-500",
    imageUrl: orbitUrl,
    description: "Curiosidad científica y visión amplia.",
  },
  {
    id: "panda-samurai",
    name: "Kendo",
    color: "from-stone-900 to-red-700",
    imageUrl: kendoUrl,
    description: "Disciplina, foco y ritmo.",
  },
  {
    id: "panda-mage",
    name: "Arcano",
    color: "from-violet-900 to-fuchsia-700",
    imageUrl: arcaneUrl,
    description: "Creatividad e intuición.",
  },
  {
    id: "panda-footballer",
    name: "Striker",
    color: "from-red-900 to-orange-500",
    imageUrl: strikerUrl,
    description: "Energía, reflejos y constancia.",
  },
  {
    id: "panda-explorer",
    name: "Explorer",
    color: "from-emerald-900 to-slate-600",
    imageUrl: explorerUrl,
    description: "Exploración, calma y autonomía.",
  },
  {
    id: "panda-robot",
    name: "Cyber",
    color: "from-slate-950 to-cyan-600",
    imageUrl: cyberUrl,
    description: "Precisión tecnológica.",
  },
];

export function getAvatarById(id: string): Avatar | undefined {
  return avatarCatalog.find((avatar) => avatar.id === id);
}

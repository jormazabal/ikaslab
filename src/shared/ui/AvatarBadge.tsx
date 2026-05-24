import { clsx } from "clsx";
import { getAvatarById } from "../../domain/avatars/avatarCatalog";

interface AvatarBadgeProps {
  avatarId: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
}

const sizes = {
  sm: "h-12 w-12 text-2xl",
  md: "h-16 w-16 text-3xl",
  lg: "h-24 w-24 text-5xl",
};

export function AvatarBadge({ avatarId, size = "md", selected = false }: AvatarBadgeProps) {
  const avatar = getAvatarById(avatarId);

  return (
    <div
      className={clsx(
        "grid shrink-0 place-items-center rounded-[1.35rem] bg-gradient-to-br text-white shadow-sm ring-offset-4",
        avatar?.color ?? "from-slate-400 to-slate-300",
        sizes[size],
        selected && "ring-4 ring-panda-leaf",
      )}
      aria-label={avatar?.name ?? "Avatar"}
    >
      <span aria-hidden>{avatar?.emoji ?? "🐼"}</span>
    </div>
  );
}

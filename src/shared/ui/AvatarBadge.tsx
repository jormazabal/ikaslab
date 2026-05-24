import { clsx } from "clsx";
import { getAvatarById } from "../../domain/avatars/avatarCatalog";

interface AvatarBadgeProps {
  avatarId: string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
}

const sizes = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

export function AvatarBadge({ avatarId, size = "md", selected = false }: AvatarBadgeProps) {
  const avatar = getAvatarById(avatarId);

  return (
    <div
      className={clsx(
        "shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm ring-offset-2",
        avatar?.color ?? "from-slate-400 to-slate-300",
        sizes[size],
        selected && "ring-2 ring-manga-cyan",
      )}
      aria-label={avatar?.name ?? "Avatar"}
    >
      {avatar?.imageUrl && (
        <img src={avatar.imageUrl} alt="" className="h-full w-full object-cover object-[center_28%]" aria-hidden />
      )}
    </div>
  );
}

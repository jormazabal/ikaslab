import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

type TagTone = "neutral" | "cyan" | "amber" | "rose";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}

const tones: Record<TagTone, string> = {
  neutral: "bg-white text-slate-600",
  cyan: "bg-cyan-50 text-cyan-900",
  amber: "bg-amber-50 text-amber-900",
  rose: "bg-rose-50 text-rose-900",
};

export function Tag({ tone = "neutral", className, ...props }: TagProps) {
  return (
    <span
      className={clsx("inline-flex items-center rounded-lg px-3 py-1 text-sm font-black shadow-sm", tones[tone], className)}
      {...props}
    />
  );
}

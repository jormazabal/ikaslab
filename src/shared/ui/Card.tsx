import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-manga-line/80 bg-white/90 p-4 shadow-soft backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/70 bg-white/86 p-5 shadow-soft backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

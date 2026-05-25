import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-white/45 bg-white/10 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/22 via-white/5 to-cyan-100/5" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/55" />
      <div className="relative">{children}</div>
    </div>
  );
}

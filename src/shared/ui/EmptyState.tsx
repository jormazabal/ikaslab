import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon = "🐼", title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 p-8 text-center">
      <div className="mb-3 text-5xl">{icon}</div>
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-600">{description}</p>
    </div>
  );
}

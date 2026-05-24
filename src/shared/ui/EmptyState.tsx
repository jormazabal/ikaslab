import type { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-manga-line bg-white/78 p-7 text-center">
      <div className="mb-3 flex justify-center text-2xl font-black text-slate-400">
        {icon ?? <BrandLogo size="sm" showText={false} />}
      </div>
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-600">{description}</p>
    </div>
  );
}

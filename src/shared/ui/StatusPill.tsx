import { clsx } from "clsx";
import type { ModuleStatus } from "../../domain/modules/types";

const labels: Record<ModuleStatus, string> = {
  active: "Activo",
  "coming-soon": "Próximamente",
  disabled: "Deshabilitado",
};

const styles: Record<ModuleStatus, string> = {
  active: "bg-cyan-50 text-cyan-800",
  "coming-soon": "bg-amber-50 text-amber-800",
  disabled: "bg-slate-200 text-slate-600",
};

export function StatusPill({ status }: { status: ModuleStatus }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-extrabold", styles[status])}>
      {labels[status]}
    </span>
  );
}

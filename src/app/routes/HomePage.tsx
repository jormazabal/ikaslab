import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { moduleRegistry } from "../../modules/registry";
import { useAppData } from "../providers/AppDataProvider";
import { Card } from "../../shared/ui/Card";
import { StatusPill } from "../../shared/ui/StatusPill";
import { formatDateTime } from "../../shared/utils/date";

export function HomePage() {
  const { currentUser, progress } = useAppData();

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-4xl font-black text-ink">Hola, {currentUser?.name}</h1>
          <p className="mt-2 max-w-2xl text-lg font-bold text-slate-600">
            Elige un módulo educativo y continúa acumulando puntos.
          </p>
        </div>
        <Card className="bg-ink text-white">
          <p className="text-sm font-bold text-white/70">Puntos acumulados</p>
          <p className="mt-2 text-4xl font-black">{currentUser?.totalPoints ?? 0}</p>
          <p className="mt-2 text-xs font-bold text-white/65">
            Último uso: {formatDateTime(currentUser?.lastUsedAt)}
          </p>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {moduleRegistry.map((module) => {
          const moduleProgress = progress.find((item) => item.moduleId === module.id);
          const summary = module.getDashboardSummary?.(moduleProgress) ?? [];
          const isEnabled = module.status === "active";

          const content = (
            <Card className="flex h-full flex-col transition hover:-translate-y-1">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-panda-sky text-4xl">
                  {module.icon}
                </div>
                <StatusPill status={module.status} />
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-panda-leaf">
                {module.category}
              </p>
              <h2 className="mt-1 text-2xl font-black text-ink">{module.title}</h2>
              <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-slate-600">
                {module.shortDescription}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {summary.length > 0 ? (
                  summary.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-500">{item.label}</p>
                      <p className="text-lg font-black text-ink">{item.value}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-500">
                    Sin progreso todavía
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between text-sm font-black text-panda-night">
                <span>{isEnabled ? "Entrar" : "No disponible"}</span>
                <ArrowRight size={18} />
              </div>
            </Card>
          );

          return isEnabled ? (
            <Link key={module.id} to={module.route} className="focus-visible:focus-ring rounded-3xl">
              {content}
            </Link>
          ) : (
            <div key={module.id} className="opacity-80">
              {content}
            </div>
          );
        })}
      </section>
    </div>
  );
}

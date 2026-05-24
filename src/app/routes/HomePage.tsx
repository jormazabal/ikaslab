import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { moduleRegistry } from "../../modules/registry";
import { useAppData } from "../providers/AppDataProvider";
import { Card } from "../../shared/ui/Card";
import { StatusPill } from "../../shared/ui/StatusPill";

export function HomePage() {
  const { currentUser, progress } = useAppData();

  return (
    <div className="space-y-6">
      <section>
        <div>
          <h1 className="text-3xl font-black text-ink">Hola, {currentUser?.name}</h1>
          <p className="mt-2 max-w-2xl text-base font-bold text-slate-600">
            Elige un módulo educativo y continúa acumulando puntos.
          </p>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {moduleRegistry.map((module) => {
          const moduleProgress = progress.find((item) => item.moduleId === module.id);
          const summary = module.getDashboardSummary?.(moduleProgress) ?? [];
          const isEnabled = module.status === "active";

          const content = (
            <Card
              className={clsx(
                "group relative flex min-h-36 overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-manga-cyan/70",
                isEnabled ? "bg-white/92" : "bg-white/72",
              )}
            >
              <div
                className={clsx(
                  "w-1.5 shrink-0",
                  isEnabled ? "bg-manga-cyan" : "bg-gradient-to-b from-amber-300 to-slate-300",
                )}
              />
              <div className="min-w-0 flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={clsx(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl text-white shadow-sm",
                        isEnabled
                          ? "bg-gradient-to-br from-slate-950 to-manga-cyan"
                          : "bg-gradient-to-br from-slate-800 to-slate-500",
                      )}
                    >
                      {module.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wide text-manga-cyan">
                        {module.category}
                      </p>
                      <h2 className="mt-0.5 truncate text-lg font-black text-ink">{module.title}</h2>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-600">
                        {module.shortDescription}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={module.status} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {summary.length > 0 ? (
                      summary.map((item) => (
                        <span
                          key={item.label}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600"
                        >
                          {item.label}
                          <strong className="text-sm text-ink">{item.value}</strong>
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">
                        Sin progreso
                      </span>
                    )}
                  </div>

                  <div
                    className={clsx(
                      "inline-flex items-center gap-2 text-sm font-black",
                      isEnabled ? "text-ink" : "text-slate-500",
                    )}
                  >
                    <span>{isEnabled ? "Entrar" : "No disponible"}</span>
                    <span
                      className={clsx(
                        "grid h-8 w-8 place-items-center rounded-full transition",
                        isEnabled
                          ? "bg-slate-900 text-white group-hover:bg-manga-coral"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );

          return isEnabled ? (
            <Link key={module.id} to={module.route} className="focus-visible:focus-ring rounded-2xl">
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

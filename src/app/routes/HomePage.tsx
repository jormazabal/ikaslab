import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { moduleRegistry } from "../../modules/registry";
import { useAppData } from "../providers/AppDataProvider";
import { GlassPanel } from "../../shared/ui/GlassPanel";
import { StatusPill } from "../../shared/ui/StatusPill";
import { Tag } from "../../shared/ui/Tag";

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
          const ModuleIcon = module.icon;

          const content = (
            <GlassPanel
              className={clsx(
                "group flex min-h-36 p-0 transition hover:border-manga-cyan/70",
                !isEnabled && "opacity-85",
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
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm",
                        isEnabled ? "bg-slate-950 text-manga-cyan" : "bg-slate-700 text-white/85",
                      )}
                    >
                      <ModuleIcon width={22} height={22} strokeWidth={2.35} aria-hidden />
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
                        <Tag
                          key={item.label}
                          className="gap-2 text-xs"
                        >
                          {item.label}
                          <strong className="text-sm text-ink">{item.value}</strong>
                        </Tag>
                      ))
                    ) : (
                      <Tag className="text-xs text-slate-500">
                        Sin progreso
                      </Tag>
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
            </GlassPanel>
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

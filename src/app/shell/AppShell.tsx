import type { ReactNode } from "react";
import { Home, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getAvatarById } from "../../domain/avatars/avatarCatalog";
import { useAppData } from "../providers/AppDataProvider";
import { BrandLogo } from "../../shared/ui/BrandLogo";
import { Button } from "../../shared/ui/Button";
import { UpdateNotifier } from "./UpdateNotifier";

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, clearCurrentUser } = useAppData();
  const location = useLocation();
  const inSettings = location.pathname.includes("/settings");
  const avatar = currentUser ? getAvatarById(currentUser.avatarId) : undefined;
  const headerActionClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-transparent !p-0 text-ink/90 transition hover:bg-white/70 hover:text-ink focus-visible:focus-ring";

  return (
    <div className="relative min-h-screen overflow-hidden manga-bg">
      {currentUser && avatar?.imageUrl && (
        <div
          className="pointer-events-none fixed bottom-0 right-0 top-0 z-0 hidden w-[min(35vw,460px)] md:block"
          style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
          aria-hidden
        >
          <img
            src={avatar.imageUrl}
            alt=""
            className="absolute bottom-0 right-0 h-full w-full object-cover object-[center_22%] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-manga-paper via-manga-paper/68 to-slate-950/24" />
          <div className="absolute inset-y-0 left-10 w-px rotate-[8deg] bg-manga-cyan/60" />
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-slate-900/30 bg-transparent shadow-md backdrop-blur-[2px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-100/20 via-slate-500/20 to-slate-950/20" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo size="sm" />
          </Link>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden min-w-28 text-right sm:block">
                <p className="text-sm font-black leading-tight text-ink">{currentUser.name}</p>
                <p className="text-xs font-bold text-slate-500">{currentUser.totalPoints} puntos</p>
              </div>
            )}
            <Link
              to="/"
              className={headerActionClass}
              title="Inicio"
            >
              <Home size={18} />
            </Link>
            {inSettings && (
              <Button variant="ghost" className={`${headerActionClass} hidden sm:inline-flex`} disabled>
                <Settings size={18} />
              </Button>
            )}
            <Button variant="ghost" className={headerActionClass} onClick={clearCurrentUser} title="Cambiar usuario">
              <LogOut size={22} strokeWidth={2.2} />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-6">{children}</main>
      <UpdateNotifier />
    </div>
  );
}

import type { ReactNode } from "react";
import { Home, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppData } from "../providers/AppDataProvider";
import { AvatarBadge } from "../../shared/ui/AvatarBadge";
import { Button } from "../../shared/ui/Button";
import { UpdateNotifier } from "./UpdateNotifier";

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, clearCurrentUser } = useAppData();
  const location = useLocation();
  const inSettings = location.pathname.includes("/settings");

  return (
    <div className="min-h-screen panda-bg">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-3xl shadow-sm">
              🐼
            </div>
            <div>
              <p className="text-xl font-black leading-tight text-ink">IkasLab</p>
              <p className="text-xs font-bold text-slate-500">Laboratorio educativo</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm sm:flex">
                <AvatarBadge avatarId={currentUser.avatarId} size="sm" />
                <div>
                  <p className="text-sm font-black text-ink">{currentUser.name}</p>
                  <p className="text-xs font-bold text-slate-500">{currentUser.totalPoints} puntos</p>
                </div>
              </div>
            )}
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-ink shadow-sm transition hover:border-panda-leaf focus-visible:focus-ring"
              title="Inicio"
            >
              <Home size={18} />
            </Link>
            {inSettings && (
              <Button variant="ghost" className="hidden px-3 sm:inline-flex" disabled>
                <Settings size={18} />
              </Button>
            )}
            <Button variant="ghost" className="px-3" onClick={clearCurrentUser} title="Cambiar usuario">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
      <UpdateNotifier />
    </div>
  );
}

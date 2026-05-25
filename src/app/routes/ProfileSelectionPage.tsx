import { FormEvent, useMemo, useState } from "react";
import { Plus, UserRound } from "lucide-react";
import { avatarCatalog } from "../../domain/avatars/avatarCatalog";
import { validateUserInput } from "../../domain/users/userRules";
import { useAppData } from "../providers/AppDataProvider";
import { AvatarBadge } from "../../shared/ui/AvatarBadge";
import { BrandLogo } from "../../shared/ui/BrandLogo";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { EmptyState } from "../../shared/ui/EmptyState";

export function ProfileSelectionPage() {
  const { users, createUser, selectUser } = useAppData();
  const [showCreate, setShowCreate] = useState(users.length === 0);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(avatarCatalog[0]?.id ?? "");
  const [error, setError] = useState("");

  const validationErrors = useMemo(
    () => validateUserInput({ name, avatarId }),
    [name, avatarId],
  );

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    await createUser({ name, avatarId });
  }

  return (
    <div className="min-h-screen manga-bg px-5 py-7">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandLogo size="lg" className="mb-4" />
            <p className="mt-2 max-w-2xl text-base font-bold text-slate-600">
              Elige tu perfil y continúa con tus módulos de aprendizaje.
            </p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setShowCreate(true)}>
            Nuevo usuario
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <section>
            {users.length === 0 ? (
              <EmptyState
                title="Aún no hay usuarios"
                description="Crea el primer perfil para guardar puntos, progreso e histórico."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => void selectUser(user.id)}
                    className="rounded-2xl border border-manga-line bg-white/90 p-4 text-left shadow-soft transition focus-visible:focus-ring"
                  >
                    <AvatarBadge avatarId={user.avatarId} size="lg" />
                    <h2 className="mt-3 text-xl font-black text-ink">{user.name}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">{user.totalPoints} puntos</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          {showCreate && (
            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-white">
                  <UserRound size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-ink">Crear usuario</h2>
                  <p className="text-sm font-semibold text-slate-500">Perfil local sin telemetría.</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-ink">Nombre</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-manga-line bg-white px-4 py-2.5 font-bold outline-none focus:focus-ring"
                    placeholder="Nombre"
                  />
                </label>

                <div>
                  <p className="mb-3 text-sm font-black text-ink">Avatar</p>
                  <div className="grid grid-cols-2 gap-3">
                    {avatarCatalog.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setAvatarId(avatar.id)}
                        className="rounded-xl border border-manga-line bg-white p-3 text-left transition hover:border-manga-cyan focus-visible:focus-ring"
                      >
                        <AvatarBadge avatarId={avatar.id} selected={avatarId === avatar.id} />
                        <p className="mt-2 text-sm font-black text-ink">{avatar.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

                <Button type="submit" className="w-full" disabled={validationErrors.length > 0}>
                  Crear y entrar
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

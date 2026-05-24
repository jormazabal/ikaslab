import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { updaterService, type UpdateStatus } from "../../services/updater/updaterService";
import { Button } from "../../shared/ui/Button";

type InstallState = "idle" | "checking" | "installing" | "installed" | "error";

export function UpdateNotifier() {
  const [status, setStatus] = useState<UpdateStatus>({ available: false });
  const [installState, setInstallState] = useState<InstallState>("checking");
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkUpdates() {
      try {
        const result = await updaterService.checkForUpdate();
        if (!cancelled) {
          setStatus(result);
          setInstallState("idle");
        }
      } catch (error) {
        console.warn("No se pudo comprobar si hay actualizaciones.", error);
        if (!cancelled) {
          setInstallState("idle");
        }
      }
    }

    void checkUpdates();

    return () => {
      cancelled = true;
    };
  }, []);

  async function installUpdate() {
    setInstallState("installing");
    setDownloadedBytes(0);

    try {
      await updaterService.downloadAndInstallLatest((event) => {
        if (event.event === "Progress") {
          setDownloadedBytes((current) => current + event.data.chunkLength);
        }
      });
      setInstallState("installed");
    } catch (error) {
      console.error(error);
      setInstallState("error");
    }
  }

  if (!status.available || dismissed || installState === "checking") {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,420px)] rounded-3xl border border-white bg-white/95 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-panda-mint text-emerald-900">
            <RefreshCw size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-ink">Nueva versión disponible</h2>
            <p className="mt-1 text-sm font-bold text-slate-600">
              Versión {status.version}. Tus usuarios, avatares, configuración y puntuaciones se
              conservan.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          title="Cerrar aviso"
        >
          <X size={18} />
        </button>
      </div>

      {status.body && <p className="mt-3 text-sm font-semibold text-slate-500">{status.body}</p>}

      {installState === "installing" && (
        <p className="mt-3 rounded-2xl bg-panda-sky px-4 py-2 text-sm font-black text-sky-900">
          Descargando actualización... {Math.round(downloadedBytes / 1024)} KB
        </p>
      )}

      {installState === "installed" && (
        <p className="mt-3 rounded-2xl bg-panda-mint px-4 py-2 text-sm font-black text-emerald-900">
          Actualización instalada. Cierra y abre IkasLab para usar la nueva versión.
        </p>
      )}

      {installState === "error" && (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">
          No se pudo instalar la actualización. Inténtalo de nuevo más tarde.
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => void installUpdate()}
          disabled={installState === "installing" || installState === "installed"}
          icon={<Download size={18} />}
        >
          Actualizar ahora
        </Button>
      </div>
    </div>
  );
}

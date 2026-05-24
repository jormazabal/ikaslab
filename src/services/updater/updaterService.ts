import { check, type DownloadEvent } from "@tauri-apps/plugin-updater";
import { isTauriRuntime } from "../persistence/tauriClient";

export interface UpdateStatus {
  available: boolean;
  version?: string;
  body?: string;
}

export const updaterService = {
  async checkForUpdate(): Promise<UpdateStatus> {
    if (!isTauriRuntime()) {
      return { available: false };
    }

    const update = await check();
    if (!update) {
      return { available: false };
    }

    return {
      available: true,
      version: update.version,
      body: update.body,
    };
  },

  async downloadAndInstallLatest(onEvent?: (event: DownloadEvent) => void): Promise<boolean> {
    if (!isTauriRuntime()) {
      return false;
    }

    const update = await check();
    if (!update) {
      return false;
    }

    await update.downloadAndInstall(onEvent);
    return true;
  },
};

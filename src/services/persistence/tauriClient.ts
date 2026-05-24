import { invoke } from "@tauri-apps/api/core";

export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function invokeCommand<T>(command: string, payload?: Record<string, unknown>): Promise<T> {
  return invoke<T>(command, payload);
}

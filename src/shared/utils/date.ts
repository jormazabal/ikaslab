export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "Sin uso todavía";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

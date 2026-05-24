import { BookOpen } from "lucide-react";
import { Card } from "../../shared/ui/Card";

export function PlaceholderModule() {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white">
        <BookOpen size={36} />
      </div>
      <h2 className="text-2xl font-black text-ink">Módulo en preparación</h2>
      <p className="mt-2 font-semibold text-slate-600">
        Esta sección ya está registrada en la plataforma y podrá activarse cuando tenga su propio
        contenido y lógica.
      </p>
    </Card>
  );
}

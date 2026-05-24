import { BookOpen } from "lucide-react";
import { Card } from "../../shared/ui/Card";

export function PlaceholderModule() {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-panda-sky text-panda-night">
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

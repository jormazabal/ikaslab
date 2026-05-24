import { HelpCircle, Send } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import type { VocabularyTerm } from "../domain/types";

interface QuestionCardProps {
  term: VocabularyTerm;
  index: number;
  total: number;
  answer: string;
  hintUsed: boolean;
  hintOptions: string[];
  feedback: string | null;
  onAnswerChange: (answer: string) => void;
  onShowHint: () => void;
  onSubmit: () => void;
  onContinue: () => void;
}

export function QuestionCard({
  term,
  index,
  total,
  answer,
  hintUsed,
  hintOptions,
  feedback,
  onAnswerChange,
  onShowHint,
  onSubmit,
  onContinue,
}: QuestionCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (feedback) {
      onContinue();
      return;
    }

    onSubmit();
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-panda-sky px-4 py-2 text-sm font-black text-panda-night">
          Pregunta {index + 1} de {total}
        </span>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
          {term.difficulty}
        </span>
      </div>

      <p className="text-3xl font-black leading-tight text-ink">{term.sentence}</p>
      {term.translation && (
        <p className="mt-3 rounded-2xl bg-panda-gold/50 px-4 py-3 text-sm font-bold text-amber-900">
          {term.translation}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          disabled={Boolean(feedback)}
          className="w-full rounded-3xl border-2 border-slate-200 bg-white px-5 py-4 text-2xl font-black text-ink outline-none transition focus:border-panda-leaf"
          placeholder="Escribe la palabra"
          autoFocus
        />

        {hintUsed && (
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-black text-slate-600">Opciones de pista</p>
            <div className="flex flex-wrap gap-2">
              {hintOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => onAnswerChange(option)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className="rounded-3xl bg-panda-mint px-5 py-4 text-lg font-black text-emerald-900">
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {!hintUsed && !feedback && (
            <Button type="button" variant="secondary" icon={<HelpCircle size={18} />} onClick={onShowHint}>
              Pista
            </Button>
          )}
          <Button type="submit" icon={<Send size={18} />}>
            {feedback ? "Continuar" : "Comprobar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

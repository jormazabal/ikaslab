import { HelpCircle, Send } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import type { VocabularyTerm } from "../domain/types";

const AUTO_CONTINUE_SECONDS = 10;

interface QuestionCardProps {
  term: VocabularyTerm;
  index: number;
  total: number;
  answer: string;
  hintUsed: boolean;
  hintOptions: string[];
  optionTranslations: Record<string, string | null | undefined>;
  feedback: string | null;
  onAnswerChange: (answer: string) => void;
  onShowHint: () => void;
  onSubmit: () => void;
  onContinue: () => void | Promise<void>;
}

export function QuestionCard({
  term,
  index,
  total,
  answer,
  hintUsed,
  hintOptions,
  optionTranslations,
  feedback,
  onAnswerChange,
  onShowHint,
  onSubmit,
  onContinue,
}: QuestionCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CONTINUE_SECONDS);
  const hasContinuedRef = useRef(false);
  const sentenceTranslation = hintUsed ? term.translation?.trim() : "";

  const continueOnce = useCallback(() => {
    if (hasContinuedRef.current) {
      return;
    }

    hasContinuedRef.current = true;
    void onContinue();
  }, [onContinue]);

  useEffect(() => {
    if (!feedback) {
      hasContinuedRef.current = false;
      setSecondsLeft(AUTO_CONTINUE_SECONDS);
      return undefined;
    }

    hasContinuedRef.current = false;
    setSecondsLeft(AUTO_CONTINUE_SECONDS);

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    const timeoutId = window.setTimeout(() => {
      continueOnce();
    }, AUTO_CONTINUE_SECONDS * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [continueOnce, feedback]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (feedback) {
      continueOnce();
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
      {sentenceTranslation && (
        <p className="mt-3 rounded-2xl bg-panda-gold/35 px-4 py-3 text-sm font-light text-amber-900">
          {sentenceTranslation}
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

        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="mb-3 text-sm font-black text-slate-600">Opciones</p>
          <div className="flex flex-wrap gap-2">
            {hintOptions.map((option) => (
              <button
                key={option}
                type="button"
                disabled={Boolean(feedback)}
                onClick={() => onAnswerChange(option)}
                className="rounded-full bg-white px-4 py-2 text-sm text-ink shadow-sm transition hover:-translate-y-0.5 disabled:opacity-70"
              >
                <span className="font-black">{option}</span>
                {hintUsed && optionTranslations[option] && (
                  <span className="font-light text-slate-500"> / {optionTranslations[option]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!hintUsed && !feedback && (
            <Button type="button" variant="secondary" icon={<HelpCircle size={18} />} onClick={onShowHint}>
              Pista
            </Button>
          )}
          {feedback && (
            <div className="min-h-12 flex-1 rounded-3xl bg-panda-mint px-5 py-3 text-base font-black text-emerald-900">
              {feedback}
            </div>
          )}
          <Button
            type="submit"
            className={feedback ? "min-w-48 justify-between" : undefined}
            icon={
              feedback ? (
                <CountdownCircle secondsLeft={secondsLeft} totalSeconds={AUTO_CONTINUE_SECONDS} />
              ) : (
                <Send size={18} />
              )
            }
          >
            {feedback ? "Continuar" : "Comprobar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function CountdownCircle({
  secondsLeft,
  totalSeconds,
}: {
  secondsLeft: number;
  totalSeconds: number;
}) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / totalSeconds;
  const dashOffset = circumference * (1 - progress);

  return (
    <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/20" aria-label={`${secondsLeft} segundos`}>
      <svg className="absolute inset-0 h-7 w-7 -rotate-90" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r={radius} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className="text-xs font-black text-white">{secondsLeft}</span>
    </span>
  );
}

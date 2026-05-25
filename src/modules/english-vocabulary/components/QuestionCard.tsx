import { clsx } from "clsx";
import { HelpCircle, Send } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { ChoiceButton } from "../../../shared/ui/ChoiceButton";
import { GlassPanel } from "../../../shared/ui/GlassPanel";
import { Tag } from "../../../shared/ui/Tag";
import type { VocabularyTerm } from "../domain/types";

const CORRECT_AUTO_CONTINUE_SECONDS = 10;
const WRONG_AUTO_CONTINUE_SECONDS = 20;

interface QuestionCardProps {
  term: VocabularyTerm;
  index: number;
  total: number;
  answer: string;
  hintUsed: boolean;
  hintOptions: string[];
  optionTranslations: Record<string, string | null | undefined>;
  feedback: string | null;
  feedbackCorrect: boolean | null;
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
  feedbackCorrect,
  onAnswerChange,
  onShowHint,
  onSubmit,
  onContinue,
}: QuestionCardProps) {
  const autoContinueSeconds = feedbackCorrect === false ? WRONG_AUTO_CONTINUE_SECONDS : CORRECT_AUTO_CONTINUE_SECONDS;
  const [secondsLeft, setSecondsLeft] = useState(autoContinueSeconds);
  const hasContinuedRef = useRef(false);
  const showTranslations = hintUsed || (Boolean(feedback) && feedbackCorrect === false);
  const sentenceTranslation = showTranslations ? term.translation?.trim() : "";

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
      setSecondsLeft(autoContinueSeconds);
      return undefined;
    }

    hasContinuedRef.current = false;
    setSecondsLeft(autoContinueSeconds);

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    const timeoutId = window.setTimeout(() => {
      continueOnce();
    }, autoContinueSeconds * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [autoContinueSeconds, continueOnce, feedback]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (feedback) {
      continueOnce();
      return;
    }

    onSubmit();
  }

  return (
    <GlassPanel className="mx-auto max-w-3xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tag tone="cyan" className="text-slate-800">
            Pregunta {index + 1} de {total}
          </Tag>
          <Tag>
            {term.difficulty}
          </Tag>
        </div>

        <p className="text-xl font-black leading-tight text-ink sm:text-2xl">{term.sentence}</p>
        {sentenceTranslation && (
          <p className="mt-3 rounded-xl border border-white/35 bg-amber-50/24 px-4 py-3 text-sm font-light text-amber-900 backdrop-blur-[2px]">
            {sentenceTranslation}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Opciones de respuesta">
            {hintOptions.map((option) => {
              const isSelected = answer === option;

              return (
                <ChoiceButton
                  key={option}
                  disabled={Boolean(feedback)}
                  selected={isSelected}
                  onClick={() => onAnswerChange(option)}
                  trailing={
                    showTranslations && optionTranslations[option] ? (
                      <span className={clsx("font-light", isSelected ? "text-white/75" : "text-slate-500")}>
                        / {optionTranslations[option]}
                      </span>
                    ) : undefined
                  }
                >
                  {option}
                </ChoiceButton>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!hintUsed && !feedback && (
              <Button type="button" variant="secondary" icon={<HelpCircle size={18} />} onClick={onShowHint}>
                Pista
              </Button>
            )}
            {feedback && (
              <div className="min-h-11 flex-1 rounded-2xl bg-cyan-50 px-5 py-3 text-base font-black text-cyan-900">
                {feedback}
              </div>
            )}
            <Button
              type="submit"
              disabled={!feedback && answer.trim().length === 0}
              className={feedback ? "min-w-48 justify-between" : undefined}
              icon={
                feedback ? (
                  <CountdownCircle secondsLeft={secondsLeft} totalSeconds={autoContinueSeconds} />
                ) : (
                  <Send size={18} />
                )
              }
            >
              {feedback ? "Continuar" : "Comprobar"}
            </Button>
          </div>
        </form>
    </GlassPanel>
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

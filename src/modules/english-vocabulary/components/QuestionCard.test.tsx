import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import type { VocabularyTerm } from "../domain/types";

const term: VocabularyTerm = {
  id: "module-1-airline-001",
  blockId: "module-1",
  word: "airline",
  sentence: "The ___ lost our suitcase after the flight.",
  translation: null,
  hint: null,
  difficulty: "easy",
  distractors: ["assess", "board", "boost", "brand"],
  enabled: true,
};

describe("QuestionCard", () => {
  it("automatically continues ten seconds after feedback is shown", () => {
    vi.useFakeTimers();
    const onContinue = vi.fn();

    render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer="airline"
        hintUsed
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        feedback="¡Correcto! +1 punto"
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={onContinue}
      />,
    );

    expect(screen.getByText("¡Correcto! +1 punto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar/ })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(9999);
    });
    expect(onContinue).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onContinue).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

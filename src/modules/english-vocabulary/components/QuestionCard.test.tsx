import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import type { VocabularyTerm } from "../domain/types";

const term: VocabularyTerm = {
  id: "module-1-airline-001",
  blockId: "module-1",
  word: "airline",
  wordTranslation: "aerolínea",
  sentence: "The ___ lost our suitcase after the flight.",
  translation: "La ___ perdió nuestra maleta después del vuelo.",
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
        optionTranslations={{
          airline: "aerolínea",
          assess: "evaluar",
          board: "embarcar",
          boost: "aumentar",
          brand: "marca",
        }}
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

  it("shows options by default and translations after asking for a hint", () => {
    const { rerender } = render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer=""
        hintUsed={false}
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{
          airline: "aerolínea",
          assess: "evaluar",
          board: "embarcar",
          boost: "aumentar",
          brand: "marca",
        }}
        feedback={null}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText("airline")).toBeInTheDocument();
    expect(screen.queryByText(/aerolínea/)).not.toBeInTheDocument();
    expect(screen.queryByText("La ___ perdió nuestra maleta después del vuelo.")).not.toBeInTheDocument();

    rerender(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer=""
        hintUsed
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{
          airline: "aerolínea",
          assess: "evaluar",
          board: "embarcar",
          boost: "aumentar",
          brand: "marca",
        }}
        feedback={null}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText(/aerolínea/)).toBeInTheDocument();
    expect(screen.getByText("La ___ perdió nuestra maleta después del vuelo.")).toBeInTheDocument();
    expect(screen.queryByText(/La palabra que falta significa/)).not.toBeInTheDocument();
  });
});

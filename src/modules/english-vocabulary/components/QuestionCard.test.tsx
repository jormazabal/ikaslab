import { act, fireEvent, render, screen } from "@testing-library/react";
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
        feedbackCorrect={true}
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

  it("keeps wrong answers on screen for twenty seconds", () => {
    vi.useFakeTimers();
    const onContinue = vi.fn();

    render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer="assess"
        hintUsed={false}
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{
          airline: "aerolínea",
          assess: "evaluar",
          board: "embarcar",
          boost: "aumentar",
          brand: "marca",
        }}
        feedback='Casi. La respuesta era "airline". -1 punto'
        feedbackCorrect={false}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={onContinue}
      />,
    );

    expect(screen.getByLabelText("20 segundos")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(19999);
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
        feedbackCorrect={null}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText("airline")).toBeInTheDocument();
    expect(screen.queryByText("Elige una opción")).not.toBeInTheDocument();
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
        feedbackCorrect={null}
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

  it("shows sentence and option translations after a wrong answer", () => {
    render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer="assess"
        hintUsed={false}
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{
          airline: "aerolínea",
          assess: "evaluar",
          board: "embarcar",
          boost: "aumentar",
          brand: "marca",
        }}
        feedback='Casi. La respuesta era "airline". -1 punto'
        feedbackCorrect={false}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText("La ___ perdió nuestra maleta después del vuelo.")).toBeInTheDocument();
    expect(screen.getByText(/aerolínea/)).toBeInTheDocument();
    expect(screen.getByText(/evaluar/)).toBeInTheDocument();
  });

  it("uses selected options as the answer instead of a text input", () => {
    const onAnswerChange = vi.fn();

    render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer=""
        hintUsed={false}
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{}}
        feedback={null}
        feedbackCorrect={null}
        onAnswerChange={onAnswerChange}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comprobar" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "airline" }));

    expect(onAnswerChange).toHaveBeenCalledWith("airline");
  });

  it("marks the selected option clearly", () => {
    render(
      <QuestionCard
        term={term}
        index={0}
        total={10}
        answer="airline"
        hintUsed={false}
        hintOptions={["airline", "assess", "board", "boost", "brand"]}
        optionTranslations={{}}
        feedback={null}
        feedbackCorrect={null}
        onAnswerChange={vi.fn()}
        onShowHint={vi.fn()}
        onSubmit={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "airline" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "assess" })).toHaveAttribute("aria-pressed", "false");
  });
});

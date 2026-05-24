import { Settings, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../app/providers/AppDataProvider";
import type { SaveGameSessionInput } from "../../domain/sessions/types";
import { vocabularyContentService, type VocabularyContentSnapshot } from "../../services/content/vocabularyContentService";
import { appRepository } from "../../services/persistence/appRepository";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { EmptyState } from "../../shared/ui/EmptyState";
import { BlockSelector } from "./components/BlockSelector";
import { QuestionCard } from "./components/QuestionCard";
import { buildHintOptions, checkAnswer, selectTermsForBlocks, stableShuffle } from "./domain/gameLogic";
import type { VocabularyTerm } from "./domain/types";

type GamePhase = "intro" | "playing" | "summary";

interface AnswerRecord {
  termId: string;
  word: string;
  answer: string;
  correct: boolean;
  points: number;
  hintUsed: boolean;
}

export function VocabularyModule() {
  const { currentUser, refresh, refreshProgress } = useAppData();
  const [snapshot, setSnapshot] = useState<VocabularyContentSnapshot | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [questions, setQuestions] = useState<VocabularyTerm[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [startedAt, setStartedAt] = useState<string>("");
  const [hintSeed, setHintSeed] = useState(0);

  useEffect(() => {
    void vocabularyContentService.getSnapshot().then((loaded) => {
      setSnapshot(loaded);
      setSelectedBlocks(loaded.blocks.filter((block) => block.enabled).map((block) => block.id));
    });
  }, []);

  const activeBlocks = useMemo(
    () => snapshot?.blocks.filter((block) => block.enabled).sort((a, b) => a.orderIndex - b.orderIndex) ?? [],
    [snapshot],
  );

  const currentTerm = questions[questionIndex];
  const score = records.reduce((total, record) => total + record.points, 0);

  const hintOptions = useMemo(() => {
    if (!currentTerm || !snapshot) {
      return [];
    }

    return buildHintOptions(currentTerm, snapshot.terms, 5, `${currentTerm.id}-${hintSeed}`);
  }, [currentTerm, hintSeed, snapshot]);

  const optionTranslations = useMemo(() => {
    if (!snapshot) {
      return {};
    }

    return snapshot.terms.reduce<Record<string, string | null | undefined>>((translations, term) => {
      translations[term.word] = term.wordTranslation;
      return translations;
    }, {});
  }, [snapshot]);

  function toggleBlock(blockId: string) {
    setSelectedBlocks((current) =>
      current.includes(blockId) ? current.filter((id) => id !== blockId) : [...current, blockId],
    );
  }

  function startGame() {
    if (!snapshot || selectedBlocks.length === 0) {
      return;
    }

    const selectedTerms = selectTermsForBlocks(snapshot.terms, selectedBlocks);
    setQuestions(stableShuffle(selectedTerms, `${selectedBlocks.join("-")}-${Date.now()}`));
    setQuestionIndex(0);
    setAnswer("");
    setHintUsed(false);
    setHintSeed(0);
    setFeedback(null);
    setFeedbackCorrect(null);
    setRecords([]);
    setStartedAt(new Date().toISOString());
    setPhase("playing");
  }

  function submitAnswer() {
    if (!currentTerm) {
      return;
    }

    const result = checkAnswer(answer, currentTerm, hintUsed);
    setFeedbackCorrect(result.isCorrect);
    setRecords((current) => [
      ...current,
      {
        termId: currentTerm.id,
        word: currentTerm.word,
        answer: result.normalizedAnswer,
        correct: result.isCorrect,
        points: result.points,
        hintUsed,
      },
    ]);
    setFeedback(
      result.isCorrect
        ? `¡Correcto! ${formatSignedPoints(result.points)}`
        : `Casi. La respuesta era "${currentTerm.word}". ${formatSignedPoints(result.points)}`,
    );
  }

  async function continueGame() {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((index) => index + 1);
      setAnswer("");
      setHintUsed(false);
      setHintSeed((current) => current + 1);
      setFeedback(null);
      setFeedbackCorrect(null);
      return;
    }

    await finishGame();
  }

  async function finishGame() {
    if (!currentUser) {
      return;
    }

    const endedAt = new Date().toISOString();
    const finalRecords = records;
    const session: SaveGameSessionInput = {
      userId: currentUser.id,
      moduleId: "english-vocabulary",
      startedAt,
      endedAt,
      score: finalRecords.reduce((total, record) => total + record.points, 0),
      correctCount: finalRecords.filter((record) => record.correct).length,
      wrongCount: finalRecords.filter((record) => !record.correct).length,
      hintsUsed: finalRecords.filter((record) => record.hintUsed).length,
      selectedBlocks,
      totalQuestions: questions.length,
      data: {
        answers: finalRecords,
      },
    };

    await appRepository.saveSession(session);
    await refreshProgress();
    await refresh();
    setPhase("summary");
  }

  if (!snapshot) {
    return <EmptyState title="Cargando vocabulario" description="Preparando bloques y términos." />;
  }

  if (snapshot.terms.length === 0) {
    return (
      <EmptyState
        title="No hay vocabulario"
        description="Añade términos desde la configuración o restaura el vocabulario inicial."
      />
    );
  }

  if (phase === "playing" && currentTerm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-manga-cyan">Vocabulario de inglés</p>
            <h1 className="text-3xl font-black text-ink">Ronda de vocabulario</h1>
          </div>
          <Card className="px-5 py-3">
            <p className="text-xs font-bold text-slate-500">Puntuación</p>
            <p className="text-2xl font-black text-ink">{score}</p>
          </Card>
        </div>
        <QuestionCard
          term={currentTerm}
          index={questionIndex}
          total={questions.length}
          answer={answer}
          hintUsed={hintUsed}
          hintOptions={hintOptions}
          optionTranslations={optionTranslations}
          feedback={feedback}
          feedbackCorrect={feedbackCorrect}
          onAnswerChange={setAnswer}
          onShowHint={() => {
            setHintSeed((current) => current + 1);
            setHintUsed(true);
          }}
          onSubmit={submitAnswer}
          onContinue={continueGame}
        />
      </div>
    );
  }

  if (phase === "summary") {
    const correct = records.filter((record) => record.correct).length;
    return (
      <Card className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white">
          <Trophy size={42} />
        </div>
        <h1 className="text-3xl font-black text-ink">Resumen de partida</h1>
        <p className="mt-3 text-base font-bold text-slate-600">
          Has conseguido {score} puntos con {correct} aciertos de {records.length}.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="text-sm font-bold text-emerald-800">Aciertos</p>
            <p className="text-3xl font-black text-ink">{correct}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="text-sm font-bold text-pink-800">Fallos</p>
            <p className="text-3xl font-black text-ink">{records.length - correct}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-sm font-bold text-sky-800">Pistas</p>
            <p className="text-3xl font-black text-ink">
              {records.filter((record) => record.hintUsed).length}
            </p>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setPhase("intro")}>Jugar otra vez</Button>
          <Link to="/">
            <Button variant="secondary">Volver a módulos</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-manga-cyan">Idiomas</p>
          <h1 className="text-3xl font-black text-ink">Vocabulario de inglés</h1>
          <p className="mt-2 max-w-3xl text-base font-bold leading-7 text-slate-600">
            Elige bloques, completa frases con una palabra en inglés y usa pistas cuando lo
            necesites. Sin pista sumas más puntos.
          </p>
        </div>
        <Card className="self-start p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-black uppercase tracking-wide text-slate-500">Reglas</span>
            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-900">
              Sin pista +3
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900">
              Con pista +1
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-900">
              Fallo -1
            </span>
            <Link to="/modules/english-vocabulary/settings" className="ml-auto">
              <Button variant="secondary" className="min-h-9 px-3 py-1.5" icon={<Settings size={16} />}>
                Configurar vocabulario
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <BlockSelector
        blocks={activeBlocks}
        counts={snapshot.blockCounts}
        selectedIds={selectedBlocks}
        onToggle={toggleBlock}
        onSelectAll={() => setSelectedBlocks(activeBlocks.map((block) => block.id))}
      />

      <div className="flex justify-end">
        <Button disabled={selectedBlocks.length === 0} onClick={startGame}>
          Iniciar partida
        </Button>
      </div>
    </div>
  );
}

function formatSignedPoints(points: number): string {
  const sign = points > 0 ? "+" : "";
  const label = Math.abs(points) === 1 ? "punto" : "puntos";
  return `${sign}${points} ${label}`;
}

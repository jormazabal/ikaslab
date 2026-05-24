import { nanoid } from "nanoid";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { vocabularyContentService, type VocabularyContentSnapshot } from "../../services/content/vocabularyContentService";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { EmptyState } from "../../shared/ui/EmptyState";
import type { Difficulty, VocabularyBlock, VocabularyTerm } from "./domain/types";

const emptyBlock: VocabularyBlock = {
  id: "",
  title: "",
  description: "",
  difficulty: "easy",
  orderIndex: 1,
  enabled: true,
};

const emptyTerm: VocabularyTerm = {
  id: "",
  blockId: "",
  word: "",
  wordTranslation: "",
  sentence: "",
  translation: "",
  hint: "",
  difficulty: "easy",
  distractors: ["", "", "", ""],
  enabled: true,
};

export function VocabularySettings() {
  const [snapshot, setSnapshot] = useState<VocabularyContentSnapshot | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string>("");
  const [blockDraft, setBlockDraft] = useState<VocabularyBlock>(emptyBlock);
  const [termDraft, setTermDraft] = useState<VocabularyTerm>(emptyTerm);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    const loaded = await vocabularyContentService.getSnapshot();
    setSnapshot(loaded);
    setSelectedBlockId((current) => current || loaded.blocks[0]?.id || "");
  }

  useEffect(() => {
    void load();
  }, []);

  const selectedTerms = useMemo(
    () =>
      snapshot?.terms
        .filter((term) => term.blockId === selectedBlockId)
        .sort((a, b) => a.word.localeCompare(b.word)) ?? [],
    [snapshot, selectedBlockId],
  );

  function editBlock(block: VocabularyBlock) {
    setBlockDraft(block);
  }

  function editTerm(term: VocabularyTerm) {
    setTermDraft(term);
  }

  async function saveBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const block: VocabularyBlock = {
      ...blockDraft,
      id: blockDraft.id || slugify(blockDraft.title || `block-${nanoid(5)}`),
      orderIndex: Number(blockDraft.orderIndex) || 1,
    };
    await vocabularyContentService.saveBlock(block);
    setBlockDraft(emptyBlock);
    setMessage("Bloque guardado.");
    await load();
  }

  async function saveTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term: VocabularyTerm = {
      ...termDraft,
      id: termDraft.id || `${termDraft.blockId}-${slugify(termDraft.word)}-${nanoid(5)}`,
      wordTranslation: termDraft.wordTranslation?.trim() || null,
      distractors: termDraft.distractors.map((item) => item.trim()).filter(Boolean),
    };
    await vocabularyContentService.saveTerm(term);
    setTermDraft({ ...emptyTerm, blockId: selectedBlockId });
    setMessage("Término guardado.");
    await load();
  }

  async function deleteBlock(blockId: string) {
    await vocabularyContentService.deleteBlock(blockId);
    setMessage("Bloque eliminado.");
    setSelectedBlockId("");
    await load();
  }

  async function deleteTerm(termId: string) {
    await vocabularyContentService.deleteTerm(termId);
    setMessage("Término eliminado.");
    await load();
  }

  async function restoreInitial() {
    await vocabularyContentService.restoreInitial();
    setMessage("Vocabulario inicial restaurado.");
    await load();
  }

  async function exportJson() {
    const pack = await vocabularyContentService.exportPack();
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ikaslab-vocabulary-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Vocabulario exportado.");
  }

  async function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      await vocabularyContentService.importPack(data);
      setMessage("JSON importado y validado.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo importar el JSON.");
    } finally {
      event.target.value = "";
    }
  }

  if (!snapshot) {
    return <EmptyState title="Cargando configuración" description="Leyendo vocabulario local." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-panda-leaf">Configuración</p>
          <h1 className="text-3xl font-black text-ink">Vocabulario de inglés</h1>
        </div>
        <Link to="/modules/english-vocabulary">
          <Button variant="secondary" icon={<ArrowLeft size={18} />}>
            Volver
          </Button>
        </Link>
      </div>

      <Card className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={importJson}
        />
        <Button variant="secondary" icon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()}>
          Importar JSON
        </Button>
        <Button variant="secondary" icon={<Download size={18} />} onClick={() => void exportJson()}>
          Exportar JSON
        </Button>
        <Button variant="secondary" icon={<RotateCcw size={18} />} onClick={() => void restoreInitial()}>
          Restaurar inicial
        </Button>
        {message && (
          <p className="flex items-center rounded-2xl bg-panda-mint px-4 py-2 text-sm font-black text-emerald-900">
            {message}
          </p>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <h2 className="text-xl font-black text-ink">Bloques</h2>
          <div className="mt-4 space-y-3">
            {snapshot.blocks
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((block) => (
                <button
                  key={block.id}
                  onClick={() => {
                    setSelectedBlockId(block.id);
                    setTermDraft({ ...emptyTerm, blockId: block.id });
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedBlockId === block.id
                      ? "border-panda-leaf bg-panda-mint"
                      : "border-slate-200 bg-white hover:border-panda-leaf"
                  }`}
                >
                  <p className="font-black text-ink">{block.title}</p>
                  <p className="text-xs font-bold text-slate-500">{snapshot.blockCounts[block.id] ?? 0} términos</p>
                </button>
              ))}
          </div>

          <form onSubmit={saveBlock} className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            <h3 className="font-black text-ink">Añadir o editar bloque</h3>
            <input
              value={blockDraft.title}
              onChange={(event) => setBlockDraft({ ...blockDraft, title: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Título"
              required
            />
            <textarea
              value={blockDraft.description}
              onChange={(event) => setBlockDraft({ ...blockDraft, description: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Descripción"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={blockDraft.difficulty}
                onChange={(event) =>
                  setBlockDraft({ ...blockDraft, difficulty: event.target.value as Difficulty })
                }
                className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              <input
                type="number"
                value={blockDraft.orderIndex}
                onChange={(event) =>
                  setBlockDraft({ ...blockDraft, orderIndex: Number(event.target.value) })
                }
                className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
                min={0}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" icon={<Save size={18} />}>
                Guardar bloque
              </Button>
              {blockDraft.id && (
                <Button type="button" variant="danger" icon={<Trash2 size={18} />} onClick={() => void deleteBlock(blockDraft.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Términos</h2>
            {selectedBlockId && (
              <Button
                variant="secondary"
                onClick={() => setTermDraft({ ...emptyTerm, blockId: selectedBlockId })}
              >
                Nuevo término
              </Button>
            )}
          </div>

          <form onSubmit={saveTerm} className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 lg:grid-cols-2">
            <input
              value={termDraft.word}
              onChange={(event) => setTermDraft({ ...termDraft, word: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Palabra correcta"
              required
            />
            <input
              value={termDraft.wordTranslation ?? ""}
              onChange={(event) => setTermDraft({ ...termDraft, wordTranslation: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Traducción de la palabra"
            />
            <select
              value={termDraft.blockId || selectedBlockId}
              onChange={(event) => setTermDraft({ ...termDraft, blockId: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              required
            >
              <option value="">Bloque</option>
              {snapshot.blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.title}
                </option>
              ))}
            </select>
            <input
              value={termDraft.sentence}
              onChange={(event) => setTermDraft({ ...termDraft, sentence: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold lg:col-span-2"
              placeholder="Frase con hueco ___"
              required
            />
            <input
              value={termDraft.translation ?? ""}
              onChange={(event) => setTermDraft({ ...termDraft, translation: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Traducción de la frase con ___"
            />
            <input
              value={termDraft.hint ?? ""}
              onChange={(event) => setTermDraft({ ...termDraft, hint: event.target.value })}
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold"
              placeholder="Pista"
            />
            <input
              value={termDraft.distractors.join(", ")}
              onChange={(event) =>
                setTermDraft({
                  ...termDraft,
                  distractors: event.target.value.split(",").map((item) => item.trim()),
                })
              }
              className="rounded-2xl border border-slate-200 px-3 py-2 font-bold lg:col-span-2"
              placeholder="Distractores separados por coma"
              required
            />
            <div className="flex flex-wrap gap-2 lg:col-span-2">
              <Button type="submit" icon={<Save size={18} />}>
                Guardar término
              </Button>
              {termDraft.id && (
                <Button type="button" variant="danger" icon={<Trash2 size={18} />} onClick={() => void deleteTerm(termDraft.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          </form>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {selectedTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => editTerm(term)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-panda-leaf focus-visible:focus-ring"
              >
                <p className="text-lg font-black text-ink">{term.word}</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">{term.sentence}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("en-US")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

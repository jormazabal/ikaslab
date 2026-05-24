import type { VocabularyBlock } from "../domain/types";
import { Card } from "../../../shared/ui/Card";

interface BlockSelectorProps {
  blocks: VocabularyBlock[];
  counts: Record<string, number>;
  selectedIds: string[];
  onToggle: (blockId: string) => void;
  onSelectAll: () => void;
}

export function BlockSelector({ blocks, counts, selectedIds, onToggle, onSelectAll }: BlockSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-ink">Bloques temáticos</h2>
        <button
          type="button"
          onClick={onSelectAll}
          className="rounded-full bg-white px-4 py-2 text-sm font-black text-panda-night shadow-sm transition hover:-translate-y-0.5"
        >
          Seleccionar todos
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => {
          const selected = selectedIds.includes(block.id);
          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onToggle(block.id)}
              className="text-left focus-visible:focus-ring rounded-3xl"
            >
              <Card
                className={
                  selected
                    ? "border-panda-leaf bg-panda-mint/80 ring-4 ring-panda-leaf/20"
                    : "hover:-translate-y-1"
                }
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl">🐾</div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                    {counts[block.id] ?? 0} términos
                  </span>
                </div>
                <h3 className="text-xl font-black text-ink">{block.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{block.description}</p>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

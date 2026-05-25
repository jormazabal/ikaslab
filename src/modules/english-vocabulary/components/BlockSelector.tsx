import { Check } from "lucide-react";
import type { VocabularyBlock } from "../domain/types";
import { Button } from "../../../shared/ui/Button";
import { GlassPanel } from "../../../shared/ui/GlassPanel";
import { Tag } from "../../../shared/ui/Tag";

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
        <h2 className="text-xl font-black text-ink">Bloques temáticos</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={onSelectAll}
          className="min-h-9 px-4 py-1.5"
        >
          Seleccionar todos
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => {
          const selected = selectedIds.includes(block.id);
          return (
            <button
              key={block.id}
              type="button"
              onClick={() => onToggle(block.id)}
              className="rounded-2xl text-left focus-visible:focus-ring"
            >
              <GlassPanel
                className={
                  selected
                    ? "min-h-[96px] border-manga-cyan bg-cyan-50/20 p-3 ring-2 ring-manga-cyan/25"
                    : "min-h-[96px] p-3"
                }
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-black text-white">
                    {block.orderIndex}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="truncate text-lg font-black text-ink">{block.title}</h3>
                      <div className="flex shrink-0 items-center gap-2">
                        <Tag className="text-xs">
                          {counts[block.id] ?? 0} términos
                        </Tag>
                        {selected && (
                          <span
                            className="grid h-7 w-7 place-items-center rounded-full bg-manga-cyan text-white shadow-sm"
                            aria-label="Seleccionado"
                          >
                            <Check size={16} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-600">
                      {block.description}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </button>
          );
        })}
      </div>
    </div>
  );
}

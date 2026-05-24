import { z } from "zod";

const difficultySchema = z.enum(["easy", "medium", "hard"]);

export const vocabularyBlockSchema = z.object({
  id: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(48),
  description: z.string().min(2).max(160),
  difficulty: difficultySchema,
  orderIndex: z.number().int().min(0),
  enabled: z.boolean(),
});

export const vocabularyTermSchema = z.object({
  id: z.string().min(3).regex(/^[a-z0-9-]+$/),
  blockId: z.string().min(2),
  word: z.string().min(1).max(48),
  wordTranslation: z.string().max(180).nullable().optional(),
  sentence: z.string().min(6).includes("___"),
  translation: z.string().max(180).nullable().optional(),
  hint: z.string().max(160).nullable().optional(),
  difficulty: difficultySchema,
  distractors: z.array(z.string().min(1).max(48)).min(4),
  enabled: z.boolean(),
  acceptedAnswers: z.array(z.string().min(1).max(48)).optional(),
});

export const vocabularyPackSchema = z
  .object({
    schemaVersion: z.literal(1),
    moduleId: z.literal("english-vocabulary"),
    exportedAt: z.string().optional(),
    blocks: z.array(vocabularyBlockSchema).min(1),
    terms: z.array(vocabularyTermSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const blockIds = new Set(pack.blocks.map((block) => block.id));
    const termIds = new Set<string>();

    for (const term of pack.terms) {
      if (!blockIds.has(term.blockId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El término ${term.id} usa un bloque inexistente: ${term.blockId}.`,
          path: ["terms", term.id],
        });
      }

      if (termIds.has(term.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `ID de término duplicado: ${term.id}.`,
          path: ["terms", term.id],
        });
      }

      termIds.add(term.id);
    }
  });

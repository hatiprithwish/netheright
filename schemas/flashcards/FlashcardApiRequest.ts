import z from "zod";

export const ZCreateDeckRequest = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});
export type CreateDeckRequest = z.infer<typeof ZCreateDeckRequest>;

export const ZUpdateDeckRequest = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});
export type UpdateDeckRequest = z.infer<typeof ZUpdateDeckRequest>;

export const ZCreateCardRequest = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  tags: z.array(z.string()).optional(),
});
export type CreateCardRequest = z.infer<typeof ZCreateCardRequest>;

export const ZBulkCreateCardsRequest = z.object({
  cards: z.array(ZCreateCardRequest).min(1).max(100),
});
export type BulkCreateCardsRequest = z.infer<typeof ZBulkCreateCardsRequest>;

export const ZUpdateCardRequest = z.object({
  front: z.string().min(1).optional(),
  back: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
});
export type UpdateCardRequest = z.infer<typeof ZUpdateCardRequest>;

export const ZSubmitReviewRequest = z.object({
  quality: z.number().int().min(0).max(5),
});
export type SubmitReviewRequest = z.infer<typeof ZSubmitReviewRequest>;

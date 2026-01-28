import { z } from "zod";

export const ZAiChatRequest = z.object({
  phase: z.string(),
});

export type AiChatRequest = z.infer<typeof ZAiChatRequest>;

import { z } from "zod";

export const ZApiResponse = z.object({
  isSuccess: z.boolean(),
  message: z.string(),
  statusCode: z.number().optional(),
});

export type ApiResponse = z.infer<typeof ZApiResponse>;

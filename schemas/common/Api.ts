import { z } from "zod";

export const ZApiResponse = z.object({
  isSuccess: z.boolean(),
  message: z.string(),
  statusCode: z.number().optional(),
});

export type ApiResponse = z.infer<typeof ZApiResponse>;

export const ZTotalRecordsResponse = ZApiResponse.extend({
  totalRecords: z.number(),
});

export type TotalRecordsResponse = z.infer<typeof ZTotalRecordsResponse>;

export const ZHasMoreData = z.object({
  hasMoreData: z.boolean(),
});

export type HasMoreData = z.infer<typeof ZHasMoreData>;

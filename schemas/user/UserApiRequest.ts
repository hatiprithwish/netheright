import { z } from "zod";
import { ZSortDirection } from "../common";
import { ZInterviewSortColumn } from "../interview";

export const ZGetInterviewsByUserRequest = z.object({
  pageNo: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  sortColumn: ZInterviewSortColumn,
  sortDirection: ZSortDirection,
});

export type GetInterviewsByUserRequest = z.infer<
  typeof ZGetInterviewsByUserRequest
> & {
  userId: string;
};

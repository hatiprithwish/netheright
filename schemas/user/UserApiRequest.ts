import { z } from "zod";
import { ZSortDirection } from "../common";
import { ZInterviewSortColumn, ZInterviewStatusIntEnum } from "../interview";

export const ZGetInterviewsByUserRequest = z.object({
  pageNo: z.number().int().min(1).nullable().optional(),
  pageSize: z.number().int().min(1).nullable().optional(),
  sortColumn: ZInterviewSortColumn.nullable().optional(),
  sortDirection: ZSortDirection.nullable().optional(),
  status: ZInterviewStatusIntEnum.nullable().optional(),
});

export type GetInterviewsByUserRequest = z.infer<
  typeof ZGetInterviewsByUserRequest
> & {
  userId: string;
};

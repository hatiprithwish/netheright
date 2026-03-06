import { z } from "zod";
import { ZSortDirection } from "../common";
import { ZInterviewSortColumn, ZInterviewStatusIntEnum } from "../interview";

export const ZGetInterviewsByUserCountRequest = z.object({
  status: ZInterviewStatusIntEnum.nullable().optional(),
  keyword: z.string().nullable().optional(),
});

export type GetInterviewsByUserCountRequest = z.infer<
  typeof ZGetInterviewsByUserCountRequest
> & {
  userId: string;
};

export const ZGetInterviewsByUserRequest =
  ZGetInterviewsByUserCountRequest.extend({
    pageNo: z.number().int().min(1).nullable().optional(),
    pageSize: z.number().int().min(1).nullable().optional(),
    sortColumn: ZInterviewSortColumn.nullable().optional(),
    sortDirection: ZSortDirection.nullable().optional(),
  });

export type GetInterviewsByUserRequest = z.infer<
  typeof ZGetInterviewsByUserRequest
> & {
  userId: string;
};

export const ZUpdateUserRoleRequest = z.object({
  roleId: z.string(),
});

export type UpdateUserRoleRequest = z.infer<typeof ZUpdateUserRoleRequest>;

export interface UpdateUserRoleRepoRequest extends UpdateUserRoleRequest {
  userId: string;
}

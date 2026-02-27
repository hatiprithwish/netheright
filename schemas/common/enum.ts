import { z } from "zod";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}
export const ZSortDirection = z.enum(SortDirection);

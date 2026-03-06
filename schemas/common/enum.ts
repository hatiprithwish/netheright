import { z } from "zod";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}
export const ZSortDirection = z.enum(SortDirection);

export enum NodeEnv {
  Development = "development",
  Production = "production",
  Staging = "staging",
}
export const ZNodeEnv = z.enum(NodeEnv);

export enum AccountProviderType {
  Google = "google",
  Github = "github",
}

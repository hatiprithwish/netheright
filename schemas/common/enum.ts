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

export enum UserRole {
  Learner = "LEARNER",
  Tester = "TESTER",
}

export enum Feature {
  SkipInterviewPhase = "SKPINTVPH",
  ManageDashboard = "MNGDSHBD",
  AttendInterview = "ATTNDINTV",
}

export enum AppStaticRoute {
  Home = "/",
  Forbidden = "/forbidden",
}

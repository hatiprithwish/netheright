import { ApiResponse } from "../common";
import { Problem, ProblemBase } from "./ProblemsCommon";

export interface GetProblemsResponse extends ApiResponse {
  problems: ProblemBase[];
}

export interface GetProblemResponse extends ApiResponse {
  problem: Problem | null;
}

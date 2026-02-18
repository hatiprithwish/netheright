import { ApiResponse } from "../common";
import { Problem, ProblemBase } from "./ProblemsCommon";

export interface GetProblemsResponse extends ApiResponse {
  problems: ProblemBase[] | null;
}

export interface GetProblemDetailsResponse extends ApiResponse {
  problem: Problem | null;
}

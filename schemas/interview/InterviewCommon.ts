import { SerializedGraph } from "@/lib/serializeGraph";
import { ChatRoleIntEnum, InterviewPhase } from "./InterviewEnum";

export type CreateSessionParams = {
  userId: string;
  problemId: string;
};

export type AddMessageParams = {
  sessionId: bigint;
  role: ChatRoleIntEnum;
  content: string;
  phase: InterviewPhase;
};

export type SaveDiagramParams = {
  sessionId: bigint;
  topology: SerializedGraph;
  rawReactFlow: any;
  phase: InterviewPhase;
  userId: string;
};
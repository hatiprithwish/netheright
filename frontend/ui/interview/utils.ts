import { UIMessage } from "ai";

export interface InterviewPhaseProps {
  messages: UIMessage[];
  sendMessage: (message: any, options?: any) => void;
  pendingPhaseTransition?: number | null;
  onConfirmTransition?: () => void;
}

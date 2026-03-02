export interface InterviewPhaseProps {
  messages: any[];
  sendMessage: (message: any, options?: any) => void;
  pendingPhaseTransition?: number | null;
  onConfirmTransition?: () => void;
  onSkipPhase?: () => void;
}

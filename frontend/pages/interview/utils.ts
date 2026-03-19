// Common for all phases
export interface InterviewPhaseProps {
  messages: any[];
  sendMessage: (message: any, options?: any) => void;
  isLoading?: boolean;
  pendingPhaseTransition?: number | null;
  onConfirmTransition?: () => void;
  onSkipPhase?: () => void;
}

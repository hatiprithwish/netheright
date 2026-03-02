"use client";

import { ChatInterface } from "../../common/ChatInterface";
import { InterviewPhaseProps } from "../../../utils";

export function RequirementsStep({
  messages,
  sendMessage,
  pendingPhaseTransition,
  onConfirmTransition,
  onSkipPhase,
}: InterviewPhaseProps) {
  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      <ChatInterface
        title="Phase 1: Requirements Gathering"
        subtitle="Ask questions to clarify the problem scope."
        messages={messages}
        onSendMessage={(text) => sendMessage({ text })}
        placeholder="Asking clarifying questions..."
        pendingPhaseTransition={pendingPhaseTransition}
        onConfirmTransition={onConfirmTransition}
        onSkipPhase={onSkipPhase}
        emptyState={
          <div className="text-center text-muted-foreground py-10">
            <p>
              Start the discussion by greeting the interviewer or asking about
              the requirements.
            </p>
          </div>
        }
      />
    </div>
  );
}

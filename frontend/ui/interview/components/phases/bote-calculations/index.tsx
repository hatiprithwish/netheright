"use client";

import { ChatInterface } from "../../common/ChatInterface";
import { InterviewPhaseProps } from "../../../utils";

export function BotECalculationStep({
  messages,
  sendMessage,
  pendingPhaseTransition,
  onConfirmTransition,
}: InterviewPhaseProps) {
  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      <ChatInterface
        title="Phase 2: Back-of-the-Envelope Calculations"
        subtitle="Estimate system scale and resource requirements."
        messages={messages}
        onSendMessage={(text) => sendMessage({ text })}
        placeholder="Share your calculations..."
        pendingPhaseTransition={pendingPhaseTransition}
        onConfirmTransition={onConfirmTransition}
        emptyState={
          <div className="text-center text-muted-foreground py-10">
            <p>Start by estimating the scale of the system.</p>
          </div>
        }
      />
    </div>
  );
}

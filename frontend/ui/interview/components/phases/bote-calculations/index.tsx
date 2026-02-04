"use client";

import { ChatInterface } from "../../common/ChatInterface";
import { InterviewPhaseProps } from "../../../utils";

export function BotECalculationStep({
  messages,
  sendMessage,
}: InterviewPhaseProps) {
  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      <ChatInterface
        title="Phase 2: Back-of-the-Envelope Calculations"
        subtitle="Estimate scale, storage, bandwidth, and other quantitative requirements."
        messages={messages}
        onSendMessage={(text) => sendMessage({ text })}
        placeholder="Share your calculations and estimates..."
        emptyState={
          <div className="text-center text-muted-foreground py-10">
            <p>
              Start by discussing your estimates for DAU, requests per second,
              storage needs, and bandwidth.
            </p>
          </div>
        }
      />
    </div>
  );
}

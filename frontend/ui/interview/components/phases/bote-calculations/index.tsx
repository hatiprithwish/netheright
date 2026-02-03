"use client";

import { useInterviewChat } from "../../../hooks/useInterviewChat";
import { useInterviewStore } from "../../../zustand";
import { ChatInterface } from "../../common/ChatInterface";
import * as Schemas from "@/schemas";

export function BotECalculationStep() {
  const sessionId = useInterviewStore((state) => state.sessionId);
  const problemId = useInterviewStore((state) => state.problemId);

  const { messages, sendMessage } = useInterviewChat({
    phase: Schemas.InterviewPhaseIntEnum.BotECalculation,
    sessionId: sessionId!,
    problemId: problemId!,
  });

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

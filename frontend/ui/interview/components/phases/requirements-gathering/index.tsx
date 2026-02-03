"use client";

import { useInterviewChat } from "../../../hooks/useInterviewChat";
import { useInterviewStore } from "../../../zustand";
import * as Schemas from "@/schemas";
import { ChatInterface } from "../../common/ChatInterface";

export function RequirementsStep() {
  const sessionId = useInterviewStore((state) => state.sessionId);
  const problemId = useInterviewStore((state) => state.problemId);

  const { messages, sendMessage } = useInterviewChat({
    sessionId: sessionId as string,
    phase: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
    problemId: problemId as number,
  });

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      <ChatInterface
        title="Phase 1: Requirements Gathering"
        subtitle="Ask questions to clarify the problem scope."
        messages={messages}
        onSendMessage={(text) => sendMessage({ text })}
        placeholder="Asking clarifying questions..."
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

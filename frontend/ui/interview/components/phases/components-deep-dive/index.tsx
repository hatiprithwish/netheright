"use client";

import { useChat } from "@ai-sdk/react";
import { useInterviewStore } from "../../../zustand";
import { HLDCanvas } from "../high-level-design/HLDCanvas";
import { useState } from "react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import { ChatInterface } from "../../common/ChatInterface";

export function ComponentsDeepDive() {
  const sessionId = useInterviewStore((state) => state.sessionId);
  const [input, setInput] = useState("");

  const body = {
    sessionId: sessionId as string,
    phaseLabel: Schemas.InterviewPhaseLabelEnum.ComponentDeepDive,
  };

  const { messages, sendMessage } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/interview/chat",
      body,
    }),
  });

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 h-full">
        <ChatInterface
          title="Phase 4: Component Deep Dive"
          subtitle="Drill down into implementation details of critical components."
          messages={messages}
          onSendMessage={(text) => sendMessage({ text })}
          placeholder="Defend your design..."
          headerClassName="p-4 border-b bg-amber-50"
          emptyState={
            <div className="text-center text-muted-foreground py-10">
              <p>
                The interviewer will now ask about specific component
                implementations.
              </p>
            </div>
          }
        />
      </div>

      <div className="flex-1 relative">
        <HLDCanvas />
      </div>
    </div>
  );
}

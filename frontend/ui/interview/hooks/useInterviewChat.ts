import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import { UIMessage } from "ai";
import { useEffect } from "react";
import { useInterviewStore } from "../zustand";

interface UseInterviewChatProps {
  sessionId: string;
  phase: Schemas.InterviewPhaseIntEnum;
  problemId: number;
  graph?: Schemas.SanitizedGraph;
  initialMessages?: UIMessage[];
}

export function useInterviewChat({
  sessionId,
  phase,
  graph,
  problemId,
  initialMessages = [],
}: UseInterviewChatProps) {
  const body: Omit<Schemas.GetChatStreamRequest, "messages"> = {
    sessionId,
    phase,
    graph,
    problemId,
  };

  const { messages, sendMessage } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/interview/chat",
      body,
    }),
    experimental_throttle: 50,
  });

  const currentPhase = useInterviewStore((state) => state.phase);
  const setPhase = useInterviewStore((state) => state.setPhase);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "assistant") return;
    lastMessage.parts.forEach((part) => {
      if (part.type === "tool-transitionToPhase" && part.output) {
        const result = part.output as { newPhase: number; status: string };

        if (result.newPhase && result.newPhase !== currentPhase) {
          setPhase(result.newPhase);
        }
      }
    });
  }, [messages, currentPhase, setPhase]);

  return {
    messages,
    sendMessage,
  };
}

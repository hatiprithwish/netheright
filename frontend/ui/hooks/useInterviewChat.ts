import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useInterviewStore } from "../interview/zustand";

interface UseInterviewChatProps {
  sessionId: string;
  phase: Schemas.InterviewPhaseIntEnum;
  problemId: number;
}

export function useInterviewChat({
  sessionId,
  phase,
  problemId,
}: UseInterviewChatProps) {
  const [previousMessages, setPreviousMessages] = useState<UIMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const body: Omit<Schemas.GetChatStreamRequest, "messages"> = {
    sessionId,
    phase,
    problemId,
  };

  // Fetch messages from current phase on mount
  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        setIsLoadingMessages(true);
        // Fetch messages for the current phase only
        const response = await fetch(
          `/api/interview/messages?sessionId=${sessionId}&upToPhase=${phase}`,
        );
        if (response.ok) {
          const data = await response.json();
          setPreviousMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchPreviousMessages();
  }, [sessionId, phase]);

  const { messages, sendMessage } = useChat({
    messages: previousMessages,
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
    isLoadingMessages,
  };
}

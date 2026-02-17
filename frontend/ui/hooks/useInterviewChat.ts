import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { useInterviewStore } from "../interview/zustand";
import Constants from "@/constants";

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
  const hasAutoStartedRef = useRef(false);

  const body: Omit<Schemas.GetChatStreamRequest, "messages"> = {
    sessionId,
    phase,
    problemId,
  };

  // Reset auto-start flag when phase changes
  useEffect(() => {
    hasAutoStartedRef.current = false;
  }, [phase]);

  // Fetch messages from current phase on mount
  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        setIsLoadingMessages(true);
        // Fetch messages for the current phase only (not all phases up to current)
        const response = await fetch(
          `/api/interview/messages?sessionId=${sessionId}&exactPhase=${phase}`,
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
  const setPendingPhaseTransition = useInterviewStore(
    (state) => state.setPendingPhaseTransition,
  );
  const confirmPhaseTransition = useInterviewStore(
    (state) => state.confirmPhaseTransition,
  );
  const pendingPhaseTransitionFromUser = useInterviewStore(
    (state) => state.pendingPhaseTransitionFromUser,
  );
  const setCompleted = useInterviewStore((state) => state.setCompleted);

  // Auto-start conversation for all phases when they have no messages
  useEffect(() => {
    // Only auto-start if:
    // 1. Messages have finished loading
    // 2. There are no previous messages for this phase
    // 3. We haven't already triggered auto-start
    if (
      !isLoadingMessages &&
      previousMessages.length === 0 &&
      !hasAutoStartedRef.current
    ) {
      hasAutoStartedRef.current = true;
      // Send trigger message to initiate LLM response
      // The LLM will receive the full chat history from previous phases via the API
      sendMessage({ text: Constants.AUTO_START_TRIGGER_MESSAGE });
    }
    // Note: sendMessage is intentionally excluded from dependencies to avoid
    // re-running this effect when the function reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isLoadingMessages, previousMessages.length]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "assistant") return;
    lastMessage.parts.forEach((part) => {
      // Handle phase transition
      if (part.type === "tool-transitionToPhase" && part.output) {
        const result = part.output as { newPhase: number; status: string };

        if (result.newPhase && result.newPhase !== currentPhase) {
          // Set pending phase transition instead of auto-transitioning
          setPendingPhaseTransition(result.newPhase);
        }
      }

      // Handle interview completion
      if (part.type === "tool-endInterview" && part.output) {
        const result = part.output as { status: string };
        if (result.status === "interview_completed") {
          setCompleted(true);
        }
      }
    });
  }, [messages, currentPhase, setPendingPhaseTransition, setCompleted]);

  return {
    messages,
    sendMessage,
    isLoadingMessages,
    pendingPhaseTransitionFromUser,
    confirmTransition: confirmPhaseTransition,
  };
}

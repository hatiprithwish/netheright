import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import { useEffect, useState } from "react";
import Constants from "@/constants";
import { updateInterviewSessionStatus } from "@/frontend/api/mutations";

interface UseInterviewChatProps {
  sessionId: string;
  phase: Schemas.InterviewPhaseIntEnum;
  problemId: number;
  onPhaseTransition?: (newPhase: number) => void;
  onCompleted?: () => void;
}

export function useInterviewChat({
  sessionId,
  phase,
  problemId,
  onPhaseTransition,
  onCompleted,
}: UseInterviewChatProps) {
  const [pendingPhaseTransition, setPendingPhaseTransition] = useState<
    number | null
  >(null);

  const body: Omit<Schemas.GetChatStreamRequest, "messages"> = {
    interviewId: sessionId,
    phase,
    problemId,
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/interview/chat",
      body,
    }),
    experimental_throttle: 50,
  });

  const isLoading = status !== "ready" && status !== "error";

  // Auto-start: send a trigger message when entering a new phase.
  // Uses a cleanup-cancelled timer so StrictMode's double-invoke doesn't fire twice.
  useEffect(() => {
    if (phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        sendMessage({ text: Constants.AUTO_START_TRIGGER_MESSAGE });
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // sendMessage is intentionally excluded to avoid re-triggering on reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "assistant") return;
    lastMessage.parts.forEach((part: any) => {
      // Handle phase transition
      if (
        part.type === "tool-transitionToPhase" &&
        part.state === "output-available" &&
        part.output
      ) {
        const result = part.output as { newPhase: number; status: string };
        if (result.newPhase && result.newPhase !== phase) {
          setPendingPhaseTransition(result.newPhase);
        }
      }

      // Handle interview completion
      if (
        part.type === "tool-endInterview" &&
        part.state === "output-available" &&
        part.output
      ) {
        const result = part.output as { status: string };
        if (result.status === "interview_completed") {
          onCompleted?.();
        }
      }
    });
  }, [messages, phase, onCompleted]);

  const confirmTransition = () => {
    if (pendingPhaseTransition !== null) {
      onPhaseTransition?.(pendingPhaseTransition);
      setPendingPhaseTransition(null);
    }
  };

  const skipPhase = async () => {
    // Only allow skip if not already at the last phase (max phase = 3 currently)
    if (phase < Schemas.InterviewPhaseIntEnum.HighLevelDesign) {
      onPhaseTransition?.(phase + 1);
      setPendingPhaseTransition(null);
    } else if (phase >= Schemas.InterviewPhaseIntEnum.HighLevelDesign) {
      // If we skip phase 3 (High Level Design), we bypass the LLM feedback
      // and directly mark the interview as completed on the frontend side.
      try {
        await updateInterviewSessionStatus(
          sessionId,
          Schemas.InterviewStatusIntEnum.Completed,
        );
      } catch (error) {
        console.error("Failed to update status to completed on skip", error);
      }
      onCompleted?.();
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    pendingPhaseTransitionFromUser: pendingPhaseTransition,
    confirmTransition,
    skipPhase,
  };
}

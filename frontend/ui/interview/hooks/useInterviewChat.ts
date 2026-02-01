"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useInterviewStore } from "../zustand";
import * as Schemas from "@/schemas";
import { useSWRConfig } from "swr";
import { useCallback, useMemo } from "react";

interface UseInterviewChatProps {
  phaseLabel: Schemas.InterviewPhaseLabelEnum;
  initialMessages?: UIMessage[];
}

export function useInterviewChat({
  phaseLabel,
  initialMessages = [],
}: UseInterviewChatProps) {
  const { sessionId, setPhase } = useInterviewStore();
  const { mutate } = useSWRConfig();

  // Stabilize initialMessages
  const stableInitialMessages = useMemo(
    () => initialMessages,
    [initialMessages],
  );

  // @ts-ignore - useChat types might be mismatching
  const {
    messages,
    input,
    setInput,
    sendMessage: chatSendMessage,
    isLoading,
    stop,
    reload,
  } = useChat({
    initialMessages: stableInitialMessages,
    api: "/api/interview/chat",
    onFinish: (result: any) => {
      // handling potential different signatures
      const message = result.message || result;

      // Check for tool calls
      if (message.toolInvocations) {
        for (const toolInvocation of message.toolInvocations) {
          if (
            toolInvocation.toolName === "transitionToPhase" &&
            toolInvocation.state === "result"
          ) {
            const result = toolInvocation.result;
            const args = toolInvocation.args;

            if (args && args.nextPhase) {
              const nextPhaseInt = parseInt(
                args.nextPhase,
                10,
              ) as Schemas.InterviewPhaseIntEnum;

              console.log("Creating phase transition to:", nextPhaseInt);
              setPhase(nextPhaseInt);
            }
          }
        }
      }

      // Revalidate session data to ensure backend state is synced
      if (sessionId) {
        mutate(`/api/interview/session/${sessionId}`);
      }
    },
  });

  const sendMessage = useCallback(
    (message: { text: string }) => {
      console.log("sendMessage called", message);

      if (!sessionId) {
        console.error("Session ID is missing, cannot send message");
        return;
      }

      if (chatSendMessage) {
        console.log("Calling chatSendMessage with dynamic body", {
          sessionId,
          phaseLabel,
        });
        chatSendMessage(
          {
            role: "user",
            content: message.text,
          },
          {
            body: {
              sessionId,
              phaseLabel,
            },
          },
        );
      } else {
        console.error("chatSendMessage is undefined");
      }
    },
    [chatSendMessage, sessionId, phaseLabel],
  );

  return {
    messages: (messages || []) as unknown as UIMessage[],
    input,
    setInput,
    sendMessage,
    isLoading,
    stop,
    reload,
  };
}

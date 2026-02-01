"use client";

import { useInterviewChat } from "../../../hooks/useInterviewChat";
import { Send, User, Bot } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useInterviewStore } from "../../../zustand";

import * as Schemas from "@/schemas";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";

export function RequirementsStep() {
  const { sessionId, setPhase, phase } = useInterviewStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  // const { messages, sendMessage } = useInterviewChat({
  //   phaseLabel: Schemas.InterviewPhaseLabelEnum.RequirementsGathering,
  // });
  const body = {
    sessionId: sessionId as string,
    phaseLabel: Schemas.InterviewPhaseLabelEnum.RequirementsGathering,
  };

  const { messages, sendMessage } = useChat({
    messages: [
      // LATER: Load messages from the DB on component mount
    ],
    transport: new DefaultChatTransport({
      api: "/api/interview/chat",
      body,
    }),
    experimental_throttle: 50,
  });

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only look at Assistant messages
    if (lastMessage.role !== "assistant") return;
    console.log("HIIIII 1");
    // Scan parts for the transition tool result
    lastMessage.parts.forEach((part) => {
      console.log("HIIIII 2");
      console.log(part);
      if (part.type === "tool-transitionToPhase" && part.output) {
        console.log("HIIIII 3");
        const result = part.output as { newPhase: number; status: string };

        if (result.newPhase && result.newPhase !== phase) {
          console.log("HIIIII 4");
          setPhase(result.newPhase);
        }
      }
    });
  }, [messages, phase, setPhase]);
  console.log(phase);

  return (
    <div className="flex flex-col h-full bg-slate-50 border rounded-xl overflow-hidden shadow-sm max-w-4xl mx-auto">
      <div className="p-4 bg-gray-100 border-b">
        Current Phase: <strong>{phase}</strong>
      </div>
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">
            Phase 1: Requirements Gathering
          </h2>
          <p className="text-sm text-muted-foreground">
            Ask questions to clarify the problem scope.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <p>
              Start the discussion by greeting the interviewer or asking about
              the requirements.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`p-3 rounded-lg max-w-[80%] text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border shadow-sm"
              }`}
            >
              {m.parts.map((part, index) => {
                switch (part.type) {
                  case "text":
                    return m.role === "assistant" ? (
                      <ReactMarkdown
                        key={index}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-slate-900">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="ml-2">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-slate-100 p-3 rounded-md overflow-x-auto mb-3">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    ) : (
                      <ReactMarkdown
                        key={index}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="ml-2">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-primary-foreground/20 px-1.5 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-primary-foreground/20 p-3 rounded-md overflow-x-auto mb-3">
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;

            // Trigger the sendMessage function manually
            sendMessage({ text: input });

            // Reset input field
            setInput("");
          }}
          className="flex gap-2"
        >
          <textarea
            className="flex-1 bg-slate-50 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={input}
            placeholder="Asking clarifying questions..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!(input || "").trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

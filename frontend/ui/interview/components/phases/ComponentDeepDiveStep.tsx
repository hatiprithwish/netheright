"use client";

import { useChat } from "@ai-sdk/react";
import { useInterviewStore } from "../../zustand";
import { ArchitectureCanvas } from "../ArchitectureCanvas";
import { useRef, useEffect, useState } from "react";
import { Send, User, Bot } from "lucide-react";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";
import ReactMarkdown from "react-markdown";

export function ComponentDeepDiveStep() {
  const { sessionId } = useInterviewStore();
  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 flex flex-col bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-amber-50">
          <h2 className="font-semibold text-lg text-amber-900">
            Phase 4: Component Deep Dive
          </h2>
          <p className="text-sm text-amber-700">
            Drill down into implementation details of critical components.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              <p>
                The interviewer will now ask about specific component
                implementations.
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
                  if (part.type === "text") {
                    return (
                      <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                    );
                  }
                  return null;
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
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex gap-2"
          >
            <input
              className="flex-1 bg-slate-50 border rounded-md px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Defend your design..."
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground px-3 rounded-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="flex-1 relative">
        <ArchitectureCanvas />
      </div>
    </div>
  );
}

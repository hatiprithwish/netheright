"use client";

import { useChat } from "@ai-sdk/react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useSdiStore } from "../../../zustand";
import { DefaultChatTransport } from "ai";
import * as Schemas from "@/schemas";

export function RequirementsStep() {
  const { sessionId } = useSdiStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
    messages: [
      // Load messages from the DB on component mount
    ],
    transport: new DefaultChatTransport({
      api: "/api/interview/chat",
      body: {
        // sessionId,
        phase: Schemas.InterviewPhase.Requirements,
      },
    }),
  });

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-50 border rounded-xl overflow-hidden shadow-sm max-w-4xl mx-auto">
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
                    return <p key={index}>{part.text}</p>;

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
          <input
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

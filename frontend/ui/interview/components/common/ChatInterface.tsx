"use client";

import { Send, User, Bot } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { UIMessage } from "ai";

interface ChatInterfaceProps {
  messages: any[];
  onSendMessage: (content: string) => void;
  title: string;
  subtitle?: string;
  placeholder?: string;
  isInputDisabled?: boolean;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  headerClassName?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  title,
  subtitle,
  placeholder = "Type your message...",
  isInputDisabled = false,
  emptyState,
  isLoading = false,
  headerClassName = "p-4 border-b bg-white",
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isInputDisabled) return;

    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className={headerClassName}>
        <h2 className="font-semibold text-lg">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && emptyState
          ? emptyState
          : messages.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                <p>No messages yet.</p>
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
              className={`p-3 rounded-lg max-w-[85%] text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border shadow-sm"
              }`}
            >
              {m.parts ? (
                m.parts.map((part: any, index: number) => {
                  if (part.type === "text") {
                    return (
                      <ReactMarkdown
                        key={index}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong
                              className={`font-semibold ${
                                m.role === "user"
                                  ? "text-primary-foreground"
                                  : "text-slate-900"
                              }`}
                            >
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="ml-2">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code
                              className={`${
                                m.role === "user"
                                  ? "bg-primary-foreground/20"
                                  : "bg-slate-100"
                              } px-1.5 py-0.5 rounded text-xs font-mono`}
                            >
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre
                              className={`${
                                m.role === "user"
                                  ? "bg-primary-foreground/20"
                                  : "bg-slate-100"
                              } p-3 rounded-md overflow-x-auto mb-2`}
                            >
                              {children}
                            </pre>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    );
                  }
                  return null;
                })
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong
                        className={`font-semibold ${
                          m.role === "user"
                            ? "text-primary-foreground"
                            : "text-slate-900"
                        }`}
                      >
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    code: ({ children }) => (
                      <code
                        className={`${
                          m.role === "user"
                            ? "bg-primary-foreground/20"
                            : "bg-slate-100"
                        } px-1.5 py-0.5 rounded text-xs font-mono`}
                      >
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre
                        className={`${
                          m.role === "user"
                            ? "bg-primary-foreground/20"
                            : "bg-slate-100"
                        } p-3 rounded-md overflow-x-auto mb-2`}
                      >
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {/* Render "Typing..." indicator if loading and last message is user? 
            Visual consistency with current app doesn't seem to have valid 'typing' state exposed 
            explicitly in UI but 'isLoading' prop exists. We can add if needed. 
        */}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-slate-50 border rounded-md px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-primary/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isInputDisabled}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            disabled={isInputDisabled || !input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

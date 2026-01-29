"use client";

import { useChat } from "@ai-sdk/react";
import { useInterviewStore } from "../zustand";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { useRef, useEffect, useState } from "react";
import { Send, User, Bot, Loader2, Wand2 } from "lucide-react";
import { serializeGraph } from "@/lib/serializeGraph";

export function Phase2Design() {
  const { sessionId, nodes, edges } = useInterviewStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    api: "/api/sdi/chat",
    body: {
      sessionId,
      phase: "high_level_design",
    },
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const topology = serializeGraph(nodes, edges);
      const response = await fetch("/api/sdi/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, graph: topology }),
      });
      const data = await response.json();

      // Append analysis result as a simplified system message or just inject into chat?
      // Let's inject it as an assistant message or trigger a chat response
      await append({
        role: "user",
        content: `Please analyze my design. Here is the AI analysis result: ${data.analysis}`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left: Chat */}
      <div className="w-1/3 flex flex-col bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold text-lg">Phase 2: Design</h2>
          <p className="text-sm text-muted-foreground">
            Draw your system and discuss trade-offs.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              <p>Start designing on the canvas -&gt;.</p>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`p-3 rounded-lg text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border"}`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 bg-slate-50 border rounded-md px-3 py-2 text-sm"
              value={input}
              onChange={handleInputChange}
              placeholder="Discuss trade-offs..."
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 rounded-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right: Canvas */}
      <div className="flex-1 relative">
        <ArchitectureCanvas />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || nodes.length === 0}
          className="absolute bottom-6 right-6 z-10 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Analyze Design
        </button>
      </div>
    </div>
  );
}

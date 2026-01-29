"use client";

import { useChat, type Message } from "ai";
import { useInterviewStore } from "../zustand";
import { ArchitectureCanvas } from "./ArchitectureCanvas";
import { useState } from "react";
import { Send, Zap } from "lucide-react";
import type { Critique } from "../sdi.schema";

interface Phase2HighLevelProps {
  sessionId: string;
}

export function Phase2HighLevel({ sessionId }: Phase2HighLevelProps) {
  const { nodes, edges } = useInterviewStore();
  const [critique, setCritique] = useState<Critique | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/sdi/chat",
      body: { sessionId, phase: "high_level" },
    });

  const handleAnalyze = async () => {
    if (nodes.length === 0) {
      alert("Please add some components to your architecture first!");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/sdi/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, nodes, edges }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();
      setCritique(result);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 h-full">
      {/* Left: Chat Panel */}
      <div className="flex flex-col border-r bg-gray-50">
        <div className="bg-white border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Phase 2: High-Level Design
          </h2>
          <p className="text-gray-600 mt-1">
            Defend your architecture with The Skeptical Architect
          </p>
        </div>

        {/* Critique Display */}
        {critique && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-2">
              Critical Flaw Identified
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              {critique.criticalFlaw}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-yellow-900">
                Severity:
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  critique.severity === "high"
                    ? "bg-red-100 text-red-800"
                    : critique.severity === "medium"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {critique.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-yellow-900 font-semibold mt-3">
              Defense Question: {critique.defenseQuestion}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Defend your design..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right: Canvas */}
      <div className="flex flex-col bg-white">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Architecture Canvas
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze Design"}
          </button>
        </div>
        <div className="flex-1">
          <ArchitectureCanvas />
        </div>
      </div>
    </div>
  );
}

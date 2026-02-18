"use client";

import { useInterviewStore } from "../../../zustand";
import { HLDCanvas } from "./HLDCanvas";
import Utilities from "@/utils";
import { useState } from "react";
import { Bot, Loader2, Wand2 } from "lucide-react";
import { ChatInterface } from "../../common/ChatInterface";
import { InterviewPhaseProps } from "../../../utils";

export function HighLevelDesign({
  messages,
  sendMessage,
  pendingPhaseTransition,
  onConfirmTransition,
}: InterviewPhaseProps) {
  const nodes = useInterviewStore((state) => state.nodes);
  const edges = useInterviewStore((state) => state.edges);
  const isHighLevelDesignSubmitted = useInterviewStore(
    (state) => state.isHighLevelDesignSubmitted,
  );
  const setHighLevelDesignSubmitted = useInterviewStore(
    (state) => state.setHighLevelDesignSubmitted,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await sendMessage(
        {
          text: "Please analyze the design",
        },
        {
          body: {
            graph: Utilities.sanitizeGraph(nodes, edges),
          },
        },
      );
      setHighLevelDesignSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left: Chat */}
      <div className="w-1/3 h-full">
        <ChatInterface
          title="Phase 3: High Level Design"
          subtitle="Draw your system and discuss trade-offs."
          messages={messages}
          onSendMessage={(text) => sendMessage({ text })}
          isInputDisabled={!isHighLevelDesignSubmitted}
          placeholder={
            isHighLevelDesignSubmitted
              ? "Discuss trade-offs..."
              : "Submit design to start chat..."
          }
          headerClassName="p-4 border-b bg-white"
          pendingPhaseTransition={pendingPhaseTransition}
          onConfirmTransition={onConfirmTransition}
          emptyState={
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground/80">
              {!isHighLevelDesignSubmitted && (
                <>
                  <Bot className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">
                    Chat is disabled until you submit your initial design.
                  </p>
                  <p className="text-xs mt-1">
                    Draw your architecture on the canvas and click &quot;Analyze
                    Design&quot; to start the discussion.
                  </p>
                </>
              )}
              {isHighLevelDesignSubmitted && (
                <p>Start designing on the canvas -&gt;.</p>
              )}
            </div>
          }
        />
      </div>

      {/* Right: Canvas */}
      <div className="flex-1 relative">
        <HLDCanvas />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || nodes.length === 0}
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

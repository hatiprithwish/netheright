"use client";

import { useState } from "react";
import { useInterviewStore } from "../zustand";
import { createInterviewSession } from "@/frontend/api/mutations";
import { Loader2, PlayCircle } from "lucide-react";

interface InterviewStartProps {
  onSessionCreated: () => void;
}

export function InterviewStart({ onSessionCreated }: InterviewStartProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSessionId = useInterviewStore((state) => state.setSessionId);
  const problemId = useInterviewStore((state) => state.problemId);
  const resetInterview = useInterviewStore((state) => state.reset);

  const handleStartInterview = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Reset all previous interview state (including nodes and edges)
      resetInterview();

      const response = await createInterviewSession({ problemId: problemId! });
      if (!response?.session) {
        throw new Error("Failed to create session");
      }
      setSessionId(response?.session?.id);
      onSessionCreated();
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to start interview. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl w-full mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-slate-200">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <PlayCircle className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                System Design Interview
              </h1>
              <p className="text-lg text-slate-600">
                Ready to start your interview session?
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h2 className="font-semibold text-slate-900 mb-3">
                What to expect:
              </h2>
              <ul className="text-left space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">1.</span>
                  <span>
                    <strong>Requirements Gathering:</strong> Clarify functional
                    and non-functional requirements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">2.</span>
                  <span>
                    <strong>Back-of-the-Envelope:</strong> Estimate system scale
                    and resource needs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">3.</span>
                  <span>
                    <strong>High-Level Design:</strong> Create your system
                    architecture diagram
                  </span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">4.</span>
                  <span>
                    <strong>Component Deep Dive:</strong> Discuss implementation
                    details of critical components
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">5.</span>
                  <span>
                    <strong>Bottlenecks & Optimization:</strong> Identify
                    bottlenecks and failure scenarios
                  </span>
                </li> */}
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleStartInterview}
              disabled={isCreating}
              className="cursor-pointer w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting Interview...
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </button>

            <p className="text-xs text-slate-500">
              Your progress will be automatically saved throughout the session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

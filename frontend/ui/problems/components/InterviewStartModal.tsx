"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/frontend/ui/interview/zustand";
import { createInterviewSession } from "@/frontend/api/mutations";
import {
  Loader2,
  X,
  Search,
  Calculator,
  Network,
  ArrowRight,
  Clock,
  Wifi,
} from "lucide-react";

interface InterviewStartModalProps {
  problemId: number;
  problemTitle: string;
  onClose: () => void;
}

export function InterviewStartModal({
  problemId,
  problemTitle,
  onClose,
}: InterviewStartModalProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSessionId = useInterviewStore((state) => state.setSessionId);
  const setProblemId = useInterviewStore((state) => state.setProblemId);
  const resetInterview = useInterviewStore((state) => state.reset);

  const handleStartInterview = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Reset all previous interview state (including nodes and edges)
      resetInterview();

      // Set the problem ID
      setProblemId(problemId);

      const response = await createInterviewSession({ problemId });
      if (!response?.session) {
        throw new Error("Failed to create session");
      }
      setSessionId(response.session.id);
      router.push(`/interview/${problemId}/${response.session.id}`);
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to start interview. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Start Interview: {problemTitle}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Estimated time: ~45 mins</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">
              What to expect:
            </h3>
            <div className="space-y-4">
              {/* Phase 1 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phase 1
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">
                      Requirements Gathering:
                    </strong>{" "}
                    Clarify <strong>functional</strong> and{" "}
                    <strong>non-functional</strong> requirements
                  </p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phase 2
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">
                      Back-of-the-Envelope:
                    </strong>{" "}
                    Estimate <strong>system scale</strong> and{" "}
                    <strong>resource needs</strong>
                  </p>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Network className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phase 3
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">
                      High-Level Design:
                    </strong>{" "}
                    Create your <strong>system architecture</strong> diagram
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Note */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Your progress will be automatically saved throughout the session
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleStartInterview}
            disabled={isCreating}
            className="cursor-pointer w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting Interview...
              </>
            ) : (
              <>
                Begin Session
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

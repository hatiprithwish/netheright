"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getInterviewFeedbackDetails } from "@/frontend/api/oneTimeQueries";
import { GradeBadge } from "./GradeBadge";
import * as Schemas from "@/schemas";

interface FeedbackModalProps {
  sessionId: string;
  onClose: () => void;
}

export function FeedbackModal({
  sessionId,

  onClose,
}: FeedbackModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] =
    useState<Schemas.GetInterviewFeedbackDetailsResponse["feedback"]>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getInterviewFeedbackDetails(sessionId);

        if (!response.isSuccess || !response.feedback) {
          setError(response.message || "Failed to load feedback");
        } else {
          setFeedback(response.feedback);
        }
      } catch (err) {
        setError("An error occurred while loading feedback");
        console.error("Error fetching feedback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Interview Feedback
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && feedback && (
            <div className="space-y-6">
              {/* Overall Grade */}
              <div className=" bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 text-center overflow-hidden border border-blue-100">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl" />

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
                    Overall Performance
                  </p>
                  <div className="flex items-center justify-center mb-3">
                    <div className="transform scale-150">
                      <GradeBadge grade={feedback.overallGrade} size="lg" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    {feedback.overallGrade === 5
                      ? "Outstanding"
                      : feedback.overallGrade === 4
                        ? "Excellent"
                        : feedback.overallGrade === 3
                          ? "Good"
                          : feedback.overallGrade === 2
                            ? "Fair"
                            : "Needs Improvement"}
                  </p>
                </div>
              </div>

              {/* Category Grades */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Requirements Gathering
                    </span>
                    <GradeBadge
                      grade={feedback.requirementsGathering}
                      size="md"
                    />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Data Modeling
                    </span>
                    <GradeBadge grade={feedback.dataModeling} size="md" />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Trade-off Analysis
                    </span>
                    <GradeBadge grade={feedback.tradeOffAnalysis} size="md" />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Scalability
                    </span>
                    <GradeBadge grade={feedback.scalability} size="md" />
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-slate-700"
                    >
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Areas */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Areas for Growth
                </h3>
                <ul className="space-y-2">
                  {feedback.growthAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-slate-700"
                    >
                      <span className="text-amber-600 mt-1">→</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Actionable Feedback
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {feedback.actionableFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

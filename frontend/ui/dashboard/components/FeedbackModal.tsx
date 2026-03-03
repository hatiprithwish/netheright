"use client";

import { X } from "lucide-react";
import { useGetInterviewFeedbackDetails } from "@/frontend/api/cachedQueries";
import { GradeBadge } from "./GradeBadge";

interface FeedbackModalProps {
  sessionId: string;
  onClose: () => void;
}

export function FeedbackModal({ sessionId, onClose }: FeedbackModalProps) {
  const { data, isLoading, error } = useGetInterviewFeedbackDetails(sessionId);

  if (!data) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-2xl font-bold text-card-foreground">
            Interview Feedback
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
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
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && data?.feedback && (
            <div className="space-y-6">
              {/* Overall Grade */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-2xl p-8 text-center overflow-hidden border border-blue-100 dark:border-blue-900/50 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                    Overall Performance
                  </p>
                  <div className="flex items-center justify-center mb-3">
                    <div className="transform scale-150">
                      <GradeBadge
                        grade={data.feedback.overallGrade}
                        size="lg"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 font-medium">
                    {data.feedback.overallGrade === 5
                      ? "Outstanding"
                      : data.feedback.overallGrade === 4
                        ? "Excellent"
                        : data.feedback.overallGrade === 3
                          ? "Good"
                          : data.feedback.overallGrade === 2
                            ? "Fair"
                            : "Needs Improvement"}
                  </p>
                </div>
              </div>

              {/* Category Grades */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Requirements Gathering
                    </span>
                    <GradeBadge
                      grade={data.feedback.requirementsGathering}
                      size="md"
                    />
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Data Modeling
                    </span>
                    <GradeBadge grade={data.feedback.dataModeling} size="md" />
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Trade-off Analysis
                    </span>
                    <GradeBadge
                      grade={data.feedback.tradeOffAnalysis}
                      size="md"
                    />
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Scalability
                    </span>
                    <GradeBadge grade={data.feedback.scalability} size="md" />
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {data.feedback.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground/80"
                    >
                      <span className="text-emerald-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Areas */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Areas for Growth
                </h3>
                <ul className="space-y-2">
                  {data.feedback.growthAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-foreground/80"
                    >
                      <span className="text-amber-500 mt-1">→</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Feedback */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-3">
                  Actionable Feedback
                </h3>
                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
                  <p className="text-foreground/90 whitespace-pre-wrap">
                    {data.feedback.actionableFeedback}
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

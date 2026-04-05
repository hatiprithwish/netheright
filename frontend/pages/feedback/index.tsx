"use client";

import { ArrowLeft } from "lucide-react";
import { useGetInterviewFeedbackDetails } from "@/frontend/api/cachedQueries";
import { GradeBadge } from "../dashboard/GradeBadge";
import { useRouter } from "next/navigation";

interface FeedbackPageProps {
  interviewId: string;
}

export default function FeedbackPage({ interviewId }: FeedbackPageProps) {
  const router = useRouter();
  const { data, isLoading, error } =
    useGetInterviewFeedbackDetails(interviewId);

  return (
    <div className="min-h-screen bg-brand-bg text-foreground pb-12">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <ArrowLeft
            className="w-6 h-6 cursor-pointer"
            onClick={() => router.back()}
          />
          <h3 className="text-2xl font-bold text-foreground capitalize">
            Interview Feedback
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border shadow-sm">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse">
                Analyzing interview performance...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <p className="text-muted-foreground">
              The requested interview feedback is currently unavailable or could
              not be retrieved.
            </p>
          )}

          {!isLoading && !error && data?.scorecard && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Overall Grade Card */}
              <div className="bg-linear-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-10 text-center overflow-hidden border border-blue-100 dark:border-blue-900/40 relative shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <p className="text-sm uppercase tracking-widest font-bold text-muted-foreground mb-6">
                    Overall Performance
                  </p>
                  <div className="flex items-center justify-center mb-6">
                    <div className="transform scale-150 shadow-xl rounded-full">
                      <GradeBadge
                        grade={data.scorecard.overallGrade}
                        size="lg"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {data.scorecard.overallGrade === 5
                      ? "Outstanding"
                      : data.scorecard.overallGrade === 4
                        ? "Excellent"
                        : data.scorecard.overallGrade === 3
                          ? "Good"
                          : data.scorecard.overallGrade === 2
                            ? "Fair"
                            : "Needs Improvement"}
                  </h2>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  Category Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Requirements Gathering",
                      val: data.scorecard.categories.requirementsGathering,
                    },
                    {
                      label: "Data Modeling",
                      val: data.scorecard.categories.dataModeling,
                    },
                    {
                      label: "Trade-off Analysis",
                      val: data.scorecard.categories.tradeOffAnalysis,
                    },
                    {
                      label: "Scalability",
                      val: data.scorecard.categories.scalability,
                    },
                  ].map((cat, i) => (
                    <div
                      key={i}
                      className="bg-secondary/30 rounded-xl p-5 flex items-center justify-between border border-border/50 hover:border-border transition-colors"
                    >
                      <span className="font-bold text-foreground/80">
                        {cat.label}
                      </span>
                      <GradeBadge grade={cat.val} size="md" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-8">
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-6">
                    Strengths
                  </h3>
                  <ul className="space-y-4">
                    {data.scorecard.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-foreground/80"
                      >
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-full p-1 mt-1">
                          <span className="block w-2h-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ✓
                          </span>
                        </div>
                        <span className="leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas */}
                <div className="bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 p-8">
                  <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-6">
                    Areas for Growth
                  </h3>
                  <ul className="space-y-4">
                    {data.scorecard.growthAreas.map((area, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-foreground/80"
                      >
                        <div className="bg-amber-100 dark:bg-amber-900/40 rounded-full p-1 mt-1">
                          <span className="block w-2h-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                            →
                          </span>
                        </div>
                        <span className="leading-relaxed">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Feedback */}
              <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Actionable Feedback
                </h3>
                <div className="bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-lg italic">
                    "{data.scorecard.actionableFeedback}"
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

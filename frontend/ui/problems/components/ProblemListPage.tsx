"use client";

import { useState } from "react";
import { useProblems } from "@/frontend/api/cachedQueries";
import { InterviewStartModal } from "./InterviewStartModal";
import { Loader2, FileText } from "lucide-react";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900/50";
    case "Medium":
      return "text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-900/50";
    case "Hard":
      return "text-red-700 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-950/30 dark:border-red-900/50";
    default:
      return "text-gray-700 bg-gray-50 border-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700";
  }
};

export function ProblemListPage() {
  const { problems, isLoading, error } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const handleProblemClick = (problem: { id: number; title: string }) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
          <p className="text-text-muted font-medium">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-bg">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-2 dark:text-red-400">
              Failed to load problems
            </p>
            <p className="text-red-600 text-sm dark:text-red-400/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-3">
            System Design Interview
          </h1>
          <p className="text-lg text-text-muted">
            Select a problem to begin your interview
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => {
            return (
              <button
                key={problem.id}
                onClick={() =>
                  handleProblemClick({ id: problem.id, title: problem.title })
                }
                className="bg-card text-card-foreground rounded-xl shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-6 text-left border border-border hover:border-brand-primary/30 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-brand-primary transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                      {problem.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                      {problem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wider font-medium text-text-muted bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {problems.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-text-muted">No problems available</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProblem !== null && (
        <InterviewStartModal
          problemId={selectedProblem.id}
          problemTitle={selectedProblem.title}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProblems } from "@/frontend/api/cachedQueries";
import { InterviewStartModal } from "./InterviewStartModal";
import { Loader2, FileText } from "lucide-react";

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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-slate-600 font-medium">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">
              Failed to load problems
            </p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            System Design Interview
          </h1>
          <p className="text-lg text-slate-600">
            Select a problem to begin your interview
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <button
              key={problem.id}
              onClick={() =>
                handleProblemClick({ id: problem.id, title: problem.title })
              }
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 text-left border border-slate-200 hover:border-primary/50 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Problem #{problem.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {problem.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {problems.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-slate-500">No problems available</p>
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

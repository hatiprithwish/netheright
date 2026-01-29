"use client";

import { useInterviewStore } from "../../zustand";
import { useEffect, useState } from "react";

export function ScorecardStep() {
  const { sessionId } = useInterviewStore();
  const [scorecard, setScorecard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching scorecard or call an action
    // For now just mock or show placeholder if backend not ready
    setLoading(false);
  }, [sessionId]);

  if (loading) return <div>Generating Scorecard...</div>;

  return (
    <div className="h-full w-full bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Interview Complete</h1>
          <p className="text-muted-foreground">
            Here is your performance breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Grade */}
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center flex flex-col justify-center items-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Overall Grade
            </h3>
            <div className="text-6xl font-black text-primary">A-</div>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              <ScoreBar label="Requirements Gathering" score={85} />
              <ScoreBar label="Data Modeling" score={72} />
              <ScoreBar label="Trade-off Analysis" score={90} />
              <ScoreBar label="Scalability" score={65} />
            </div>
          </div>
        </div>

        {/* Placeholder for dynamic content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-medium mb-4">Feedback</h3>
          <p className="text-muted-foreground">
            Analysis pending real backend implementation...
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${score > 80 ? "bg-green-500" : score > 60 ? "bg-yellow-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

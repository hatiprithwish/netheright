"use client";

import { useSdiStore } from "./zustand";
import { MobileBlocker } from "./components/MobileBlocker";
import { RequirementsStep } from "./components/phases/requirements";
import { Phase2Design } from "./components/Phase2Design";
import { DeepDiveStep } from "./components/phases/DeepDiveStep";
import { ScorecardStep } from "./components/phases/ScorecardStep";

export default function InterviewPage({ problemId }: { problemId: string }) {
  const { phase, setPhase } = useSdiStore();

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <MobileBlocker />

      <header className="h-14 bg-white border-b flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-1 text-sm bg-slate-50 p-1 rounded-lg border">
          <PhaseStep
            current={phase}
            step="requirements"
            label="1. Requirements"
            onClick={() => setPhase("requirements")}
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step="high_level_design"
            label="2. Architecture"
            onClick={() => setPhase("high_level_design")}
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step="deep_dive"
            label="3. Deep Dive"
            onClick={() => setPhase("deep_dive")}
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step="scorecard"
            label="4. Results"
            onClick={() => setPhase("scorecard")}
          />
        </div>

        <div className="w-24">{/* User menu placeholder */}</div>
      </header>

      <main className="flex-1 p-4 overflow-hidden relative">
        {phase === "requirements" && <RequirementsStep />}
        {phase === "high_level_design" && <Phase2Design />}
        {phase === "deep_dive" && <DeepDiveStep />}
        {phase === "scorecard" && <ScorecardStep />}
      </main>
    </div>
  );
}

function PhaseStep({
  current,
  step,
  label,
  onClick,
}: {
  current: string;
  step: string;
  label: string;
  onClick: () => void;
}) {
  const isActive = current === step;
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md transition-all ${isActive ? "bg-white shadow text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-slate-100"}`}
    >
      {label}
    </button>
  );
}

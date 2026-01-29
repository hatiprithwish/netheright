"use client";

import { useState } from "react";
import { useInterviewStore } from "./zustand";
import { MobileBlocker } from "./components/MobileBlocker";
import { InterviewStart } from "./components/InterviewStart";
import { RequirementsStep } from "./components/phases/requirements";
import { Phase2Design } from "./components/Phase2Design";
import { DeepDiveStep } from "./components/phases/DeepDiveStep";
import { ScorecardStep } from "./components/phases/ScorecardStep";
import * as Schemas from "@/schemas";

export default function InterviewPage({ problemId }: { problemId: number }) {
  const { phase, setPhase, sessionId } = useInterviewStore();
  const [hasStarted, setHasStarted] = useState(false);

  // Show start screen if no session exists
  if (!sessionId || !hasStarted) {
    return (
      <InterviewStart
        problemId={problemId}
        onSessionCreated={() => setHasStarted(true)}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <MobileBlocker />

      <header className="h-14 bg-white border-b flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-1 text-sm bg-slate-50 p-1 rounded-lg border">
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.RequirementsGathering}
            label={`1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering.toUpperCase()}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.RequirementsGathering)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.HighLevelDesign}
            label={`2. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign.toUpperCase()}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.HighLevelDesign)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.DeepDive}
            label={`3. ${Schemas.InterviewPhaseLabelEnum.DeepDive.toUpperCase()}`}
            onClick={() => setPhase(Schemas.InterviewPhaseIntEnum.DeepDive)}
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.Scorecard}
            label={`4. ${Schemas.InterviewPhaseLabelEnum.Scorecard.toUpperCase()}`}
            onClick={() => setPhase(Schemas.InterviewPhaseIntEnum.Scorecard)}
          />
        </div>

        <div className="w-24">{/* User menu placeholder */}</div>
      </header>

      <main className="flex-1 p-4 overflow-hidden relative">
        {phase === Schemas.InterviewPhaseIntEnum.RequirementsGathering && (
          <RequirementsStep />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <Phase2Design />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.DeepDive && <DeepDiveStep />}
        {phase === Schemas.InterviewPhaseIntEnum.Scorecard && <ScorecardStep />}
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
  current: Schemas.InterviewPhaseIntEnum;
  step: Schemas.InterviewPhaseIntEnum;
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

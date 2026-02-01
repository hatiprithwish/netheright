"use client";

import { useState } from "react";
import { useInterviewStore } from "./zustand";
import { MobileBlocker } from "./components/MobileBlocker";
import { InterviewStart } from "./components/InterviewStart";
import { RequirementsStep } from "./components/phases/requirements-gathering";
import { BotECalculationStep } from "./components/phases/bote-calculations";
import { Phase2Design } from "./components/Phase2Design";
import { ComponentDeepDiveStep } from "./components/phases/ComponentDeepDiveStep";
import { BottlenecksDiscussionStep } from "./components/phases/BottlenecksDiscussionStep";
import * as Schemas from "@/schemas";

export default function InterviewPage({ problemId }: { problemId: number }) {
  const { phase, setPhase, sessionId } = useInterviewStore();
  const [hasStarted, setHasStarted] = useState(false);

  // Show start screen if no session exists - simplified check
  if (!sessionId && !hasStarted) {
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

      <header className="h-14 bg-white border-b flex items-center px-6 justify-between shrink-0 shadow-sm z-10 overflow-x-auto">
        <div className="flex items-center gap-1 text-sm bg-slate-50 p-1 rounded-lg border min-w-fit">
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.RequirementsGathering}
            label={`1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.RequirementsGathering)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BotECalculation}
            label={`2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.BotECalculation)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.HighLevelDesign}
            label={`3. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.HighLevelDesign)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.ComponentDeepDive}
            label={`4. ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.ComponentDeepDive)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion}
            label={`5. ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}`}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion)
            }
          />
        </div>

        <div className="w-24 hidden md:block">
          {/* User menu placeholder */}
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden relative">
        {phase === Schemas.InterviewPhaseIntEnum.RequirementsGathering && (
          <RequirementsStep />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BotECalculation && (
          <BotECalculationStep />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <Phase2Design />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.ComponentDeepDive && (
          <ComponentDeepDiveStep />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion && (
          <BottlenecksDiscussionStep />
        )}
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
      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${isActive ? "bg-white shadow text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-slate-100"}`}
    >
      {label}
    </button>
  );
}

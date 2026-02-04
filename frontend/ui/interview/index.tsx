"use client";

import { useState, useEffect } from "react";
import { useInterviewStore } from "./zustand";
import { MobileBlocker } from "./components/MobileBlocker";
import { InterviewStart } from "./components/InterviewStart";
import { RequirementsStep } from "./components/phases/requirements-gathering";
import { BotECalculationStep } from "./components/phases/bote-calculations";
import { HighLevelDesign } from "./components/phases/high-level-design";
import { ComponentsDeepDive } from "./components/phases/components-deep-dive";
import { BottlenecksDiscussion } from "./components/phases/bottlenecks-discussion";
import { useInterviewChat } from "../hooks/useInterviewChat";
import Utilities from "@/utils";
import * as Schemas from "@/schemas";

export default function InterviewPage({ problemId }: { problemId: number }) {
  const sessionId = useInterviewStore((state) => state.sessionId);
  const [hasStarted, setHasStarted] = useState(false);
  const problemIdInZustand = useInterviewStore((state) => state.problemId);
  const setProblemId = useInterviewStore((state) => state.setProblemId);

  useEffect(() => {
    if (problemIdInZustand !== problemId) {
      setProblemId(Number(problemId));
    }
  }, [problemId, problemIdInZustand]);

  if (!sessionId && !hasStarted) {
    return <InterviewStart onSessionCreated={() => setHasStarted(true)} />;
  }

  return sessionId ? (
    <InterviewSessionView sessionId={sessionId} problemId={problemId} />
  ) : null;
}

function InterviewSessionView({
  sessionId,
  problemId,
}: {
  sessionId: string;
  problemId: number;
}) {
  const phase = useInterviewStore((state) => state.phase);
  const setPhase = useInterviewStore((state) => state.setPhase);
  const maxReachedPhase = useInterviewStore((state) => state.maxReachedPhase);

  return (
    <InterviewChatWrapper
      key={`phase-${phase}`}
      sessionId={sessionId}
      problemId={problemId}
      phase={phase}
      setPhase={setPhase}
      maxReachedPhase={maxReachedPhase}
    />
  );
}

function InterviewChatWrapper({
  sessionId,
  problemId,
  phase,
  setPhase,
  maxReachedPhase,
}: {
  sessionId: string;
  problemId: number;
  phase: Schemas.InterviewPhaseIntEnum;
  setPhase: (phase: Schemas.InterviewPhaseIntEnum) => void;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
}) {
  const { messages, sendMessage } = useInterviewChat({
    sessionId,
    phase: phase,
    problemId: problemId,
  });

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <MobileBlocker />

      <header className="h-14 bg-white border-b flex items-center px-6 justify-between shrink-0 shadow-sm z-10 overflow-x-auto">
        <div className="flex items-center gap-1 text-sm bg-slate-50 p-1 rounded-lg border min-w-fit">
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.RequirementsGathering}
            label={`1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.RequirementsGathering)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BotECalculation}
            label={`2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.BotECalculation)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.HighLevelDesign}
            label={`3. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.HighLevelDesign)
            }
          />
          {/* <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.ComponentDeepDive}
            label={`4. ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.ComponentDeepDive)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion}
            label={`5. ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              setPhase(Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion)
            }
          /> */}
        </div>

        <div className="w-24 hidden md:block">
          {/* User menu placeholder */}
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden relative">
        {phase === Schemas.InterviewPhaseIntEnum.RequirementsGathering && (
          <RequirementsStep messages={messages} sendMessage={sendMessage} />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BotECalculation && (
          <BotECalculationStep messages={messages} sendMessage={sendMessage} />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <HighLevelDesign messages={messages} sendMessage={sendMessage} />
        )}
        {/* {phase === Schemas.InterviewPhaseIntEnum.ComponentDeepDive && (
          <ComponentsDeepDive />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion && (
          <BottlenecksDiscussion />
        )} */}
      </main>
    </div>
  );
}

function PhaseStep({
  current,
  step,
  label,
  maxReachedPhase,
  onClick,
}: {
  current: Schemas.InterviewPhaseIntEnum;
  step: Schemas.InterviewPhaseIntEnum;
  label: string;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
  onClick: () => void;
}) {
  const isActive = current === step;
  const isDisabled = step > maxReachedPhase;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
        isActive
          ? "bg-white shadow text-primary font-medium"
          : isDisabled
            ? "text-slate-300 cursor-not-allowed"
            : "text-muted-foreground hover:text-foreground hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

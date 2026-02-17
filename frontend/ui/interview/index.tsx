"use client";

import { useState, useEffect } from "react";
import { useInterviewStore } from "./zustand";
import { MobileBlocker } from "./components/MobileBlocker";
import { InterviewCompletionScreen } from "./components/InterviewCompletionScreen";
import { RequirementsStep } from "./components/phases/requirements-gathering";
import { BotECalculationStep } from "./components/phases/bote-calculations";
import { HighLevelDesign } from "./components/phases/high-level-design";
import { useInterviewChat } from "../hooks/useInterviewChat";
import * as Schemas from "@/schemas";
import { useRouter } from "next/navigation";
import { updateInterviewSessionStatus } from "@/frontend/api/mutations";
import { toast } from "sonner";

export default function InterviewPage({
  problemId,
  sessionId: sessionIdFromUrl,
}: {
  problemId: number;
  sessionId?: string;
}) {
  const sessionId = useInterviewStore((state) => state.sessionId);
  const setSessionId = useInterviewStore((state) => state.setSessionId);
  const problemIdInZustand = useInterviewStore((state) => state.problemId);
  const setProblemId = useInterviewStore((state) => state.setProblemId);

  useEffect(() => {
    if (problemIdInZustand !== problemId) {
      setProblemId(Number(problemId));
    }
  }, [problemId, problemIdInZustand, setProblemId]);

  useEffect(() => {
    if (sessionIdFromUrl && sessionId !== sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
    }
  }, [sessionIdFromUrl, sessionId, setSessionId]);

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
  const isCompleted = useInterviewStore((state) => state.isCompleted);

  // Show completion screen if interview is completed
  if (isCompleted) {
    return <InterviewCompletionScreen />;
  }

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
  const {
    messages,
    sendMessage,
    pendingPhaseTransitionFromUser,
    confirmTransition,
  } = useInterviewChat({
    sessionId,
    phase: phase,
    problemId: problemId,
  });

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <MobileBlocker />

      <header className="h-14 bg-white border-b flex items-center px-6 justify-center shrink-0 shadow-sm z-10 overflow-x-auto relative">
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

        <div className="absolute right-6">
          <AbandonInterviewButton />
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden relative">
        {phase === Schemas.InterviewPhaseIntEnum.RequirementsGathering && (
          <RequirementsStep
            messages={messages}
            sendMessage={sendMessage}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BotECalculation && (
          <BotECalculationStep
            messages={messages}
            sendMessage={sendMessage}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <HighLevelDesign
            messages={messages}
            sendMessage={sendMessage}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
          />
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
  const isDisabled = current !== step; // Disable all phases except current

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
        isActive
          ? "bg-white shadow text-primary font-medium"
          : "text-slate-300 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );
}

function AbandonInterviewButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const resetInterview = useInterviewStore((state) => state.reset);
  const sessionId = useInterviewStore((state) => state.sessionId);
  const router = useRouter();

  const handleAbandon = async () => {
    try {
      if (!sessionId) {
        return;
      }
      const response = await updateInterviewSessionStatus(
        sessionId,
        Schemas.InterviewSessionStatusIntEnum.Abandoned,
      );
      if (response.isSuccess) {
        toast.success("Interview abandoned successfully");
      }
    } catch (error) {
      toast.error("Failed to abandon interview");
    } finally {
      resetInterview();
      router.push("/dashboard");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Abandon Interview
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Abandon Interview?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to abandon this interview? Your progress
              will be lost and you'll be redirected to the home page.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAbandon}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Yes, Abandon
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

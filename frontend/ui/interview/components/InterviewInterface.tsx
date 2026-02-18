"use client";

import { useRouter } from "next/navigation";
import * as Schemas from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobileBlocker } from "./MobileBlocker";
import { PhaseStep } from "./PhaseStep";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import { useInterviewStore } from "../zustand";
import { updateInterviewSessionStatus } from "@/frontend/api/mutations";
import { RequirementsStep } from "./phases/requirements-gathering";
import { BotECalculationStep } from "./phases/bote-calculations";
import { HighLevelDesign } from "./phases/high-level-design";
import { useInterviewChat } from "../../hooks/useInterviewChat";

export function InterviewInterface({
  sessionId,
  problemId,
  phase,
  onPhaseChange,
  maxReachedPhase,
}: {
  sessionId: string;
  problemId: number;
  phase: Schemas.InterviewPhaseIntEnum;
  onPhaseChange: (phase: number) => void;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
}) {
  const router = useRouter();
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const resetGraph = useInterviewStore((state) => state.reset);

  const handleAbandon = async () => {
    try {
      setIsAbandoning(true);
      const response = await updateInterviewSessionStatus(
        sessionId,
        Schemas.InterviewStatusIntEnum.Abandoned,
      );
      if (response.isSuccess) {
        toast.success("Interview abandoned successfully");
      }
    } catch (error) {
      toast.error("Failed to abandon interview");
    } finally {
      setIsAbandoning(false);
      setShowAbandonConfirm(false);
      resetGraph(); // Only reset graph state
      router.push("/dashboard");
    }
  };

  const {
    messages,
    sendMessage,
    pendingPhaseTransitionFromUser,
    confirmTransition,
  } = useInterviewChat({
    sessionId,
    phase: phase,
    problemId: problemId,
    onPhaseTransition: onPhaseChange,
    onCompleted: () => {
      // Redirect to completion screen by navigating to the session URL
      router.push(`/interview/${problemId}?session=${sessionId}`);
    },
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
              onPhaseChange(Schemas.InterviewPhaseIntEnum.RequirementsGathering)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BotECalculation}
            label={`2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              onPhaseChange(Schemas.InterviewPhaseIntEnum.BotECalculation)
            }
          />
          <span className="text-slate-300">›</span>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.HighLevelDesign}
            label={`3. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              onPhaseChange(Schemas.InterviewPhaseIntEnum.HighLevelDesign)
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
          <Button
            variant="ghost"
            onClick={() => setShowAbandonConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
              className="mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Abandon Interview
          </Button>
        </div>
      </header>

      <ConfirmationModal
        open={showAbandonConfirm}
        onOpenChange={setShowAbandonConfirm}
        title="Abandon Interview?"
        description="Are you sure you want to abandon this interview? Your progress will be lost and you'll be redirected to the home page."
        confirmText="Yes, Abandon"
        variant="destructive"
        onConfirm={handleAbandon}
        isLoading={isAbandoning}
      />

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

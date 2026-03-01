"use client";

import { useRouter } from "next/navigation";
import * as Schemas from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut } from "lucide-react";
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
import { useAuth } from "@/frontend/ui/hooks/useAuth";

export function InterviewInterface({
  sessionId,
  problemId,
  problemTitle,
  phase,
  onPhaseChange,
  maxReachedPhase,
  onSessionRefresh,
}: {
  sessionId: string;
  problemId: number;
  problemTitle: string;
  phase: Schemas.InterviewPhaseIntEnum;
  onPhaseChange: (phase: number) => void;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
  onSessionRefresh: () => void;
}) {
  const router = useRouter();
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const resetGraph = useInterviewStore((state) => state.reset);
  const { currentUser } = useAuth();

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
    skipPhase,
  } = useInterviewChat({
    sessionId,
    phase: phase,
    problemId: problemId,
    onPhaseTransition: onPhaseChange,
    onCompleted: () => {
      // Force refresh session to see updated status
      onSessionRefresh();
      // Redirect to completion screen by navigating to the session URL
      router.push(`/interview/${problemId}/${sessionId}`);
    },
  });

  return (
    <div className="h-screen w-full bg-brand-bg flex flex-col font-sans">
      <MobileBlocker />

      {currentUser?.roleName === "TESTER" && (
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-4 py-1.5 text-center text-sm font-medium border-b border-orange-200 dark:border-orange-800/50 flex items-center justify-center z-20 shadow-sm relative shrink-0">
          You're in test mode
        </div>
      )}

      <header className="h-14 bg-card border-border border-b flex items-center px-6 justify-between shrink-0 shadow-sm z-10 overflow-x-auto relative">
        <div className="font-bold text-lg text-foreground">{problemTitle}</div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 p-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.RequirementsGathering}
            label={`1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              onPhaseChange(Schemas.InterviewPhaseIntEnum.RequirementsGathering)
            }
          />
          <div className="w-4 h-px bg-border"></div>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.BotECalculation}
            label={`2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              onPhaseChange(Schemas.InterviewPhaseIntEnum.BotECalculation)
            }
          />
          <div className="w-4 h-px bg-border"></div>
          <PhaseStep
            current={phase}
            step={Schemas.InterviewPhaseIntEnum.HighLevelDesign}
            label={`3. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}`}
            maxReachedPhase={maxReachedPhase}
            onClick={() =>
              onPhaseChange(Schemas.InterviewPhaseIntEnum.HighLevelDesign)
            }
          />
        </div>

        <div className="">
          <Button
            variant="ghost"
            onClick={() => setShowAbandonConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
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
            onSkipPhase={skipPhase}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BotECalculation && (
          <BotECalculationStep
            messages={messages}
            sendMessage={sendMessage}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
            onSkipPhase={skipPhase}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <HighLevelDesign
            messages={messages}
            sendMessage={sendMessage}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
            onSkipPhase={skipPhase}
          />
        )}
      </main>
    </div>
  );
}

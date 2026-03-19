"use client";

import { useRouter } from "next/navigation";
import * as Schemas from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/frontend/components/shadcn/button";
import { MobileBlocker } from "./MobileBlocker";
import { PhaseStep } from "./PhaseStep";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { useInterviewStore } from "../zustand";
import { updateInterviewSessionStatus } from "@/frontend/api/mutations";
import { RequirementsStep } from "./phases/requirements-gathering";
import { BotECalculationStep } from "./phases/bote-calculations";
import { HighLevelDesign } from "./phases/high-level-design";
import { useInterviewChat } from "../../../hooks/useInterviewChat";
import { useAuth } from "@/frontend/hooks/useAuth";

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
    isLoading,
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

      <header className="bg-card border-border border-b flex flex-col md:flex-row items-center justify-between shrink-0 shadow-sm z-10 px-4 py-2 md:py-0 md:px-6 md:h-14 gap-3 md:gap-0 relative w-full">
        <div className="w-full md:w-auto flex items-center justify-between">
          <div className="font-bold text-base md:text-lg text-foreground truncate mr-2">
            {problemTitle}
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAbandonConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer h-8 w-8"
              title="Abandon Interview"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm w-max mx-auto md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <PhaseStep
              current={phase}
              step={Schemas.InterviewPhaseIntEnum.RequirementsGathering}
              label={`1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}`}
              maxReachedPhase={maxReachedPhase}
              onClick={() =>
                onPhaseChange(
                  Schemas.InterviewPhaseIntEnum.RequirementsGathering,
                )
              }
            />
            <div className="w-2 sm:w-4 h-px bg-border shrink-0"></div>
            <PhaseStep
              current={phase}
              step={Schemas.InterviewPhaseIntEnum.BotECalculation}
              label={`2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`}
              maxReachedPhase={maxReachedPhase}
              onClick={() =>
                onPhaseChange(Schemas.InterviewPhaseIntEnum.BotECalculation)
              }
            />
            <div className="w-2 sm:w-4 h-px bg-border shrink-0"></div>
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
        </div>

        <div className="hidden md:block">
          <Button
            variant="ghost"
            onClick={() => setShowAbandonConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
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
            isLoading={isLoading}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
            onSkipPhase={skipPhase}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.BotECalculation && (
          <BotECalculationStep
            messages={messages}
            sendMessage={sendMessage}
            isLoading={isLoading}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
            onSkipPhase={skipPhase}
          />
        )}
        {phase === Schemas.InterviewPhaseIntEnum.HighLevelDesign && (
          <HighLevelDesign
            messages={messages}
            sendMessage={sendMessage}
            isLoading={isLoading}
            pendingPhaseTransition={pendingPhaseTransitionFromUser}
            onConfirmTransition={confirmTransition}
            onSkipPhase={skipPhase}
          />
        )}
      </main>
    </div>
  );
}

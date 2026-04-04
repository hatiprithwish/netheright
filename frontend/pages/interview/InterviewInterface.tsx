"use client";

import { useRouter } from "next/navigation";
import * as Schemas from "@/schemas";
import { toast } from "sonner";
import { Fragment, useState } from "react";
import { CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/frontend/components/shadcn/button";
import { MobileBlocker } from "./MobileBlocker";
import { PhaseStep } from "./PhaseStep";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { useInterviewStore } from "./zustand";
import { updateInterviewSessionStatus } from "@/frontend/api/mutations";
import { useInterviewChat } from "../../hooks/useInterviewChat";
import { useAuth } from "@/lib/next-auth/useAuth";
import { ACTIVE_PHASES, PHASE_COMPONENT_MAP } from "./utils";

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
  const [isCompleted, setIsCompleted] = useState(false);
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
      resetGraph();
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
    phase,
    problemId,
    onPhaseTransition: onPhaseChange,
    onCompleted: () => {
      setIsCompleted(true);
      onSessionRefresh();
    },
  });

  const PhaseComponent = PHASE_COMPONENT_MAP[phase];

  return (
    <div className="h-screen w-full bg-brand-bg flex flex-col font-sans relative">
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
            {ACTIVE_PHASES.map(({ step, label }, i) => (
              <Fragment key={step}>
                {i > 0 && (
                  <div className="w-2 sm:w-4 h-px bg-border shrink-0" />
                )}
                <PhaseStep
                  current={phase}
                  step={step}
                  label={label}
                  maxReachedPhase={maxReachedPhase}
                  onClick={() => onPhaseChange(step)}
                />
              </Fragment>
            ))}
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
        <PhaseComponent
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
          pendingPhaseTransition={pendingPhaseTransitionFromUser}
          onConfirmTransition={confirmTransition}
          onSkipPhase={skipPhase}
        />
      </main>

      {/* Inline completion banner — shown when interview ends */}
      {isCompleted && (
        <CompletionBanner interviewId={sessionId} onReset={resetGraph} />
      )}
    </div>
  );
}

function CompletionBanner({
  interviewId,
  onReset,
}: {
  interviewId: string;
  onReset: () => void;
}) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    onReset();
    router.push("/dashboard");
  };

  const handleViewFeedback = () => {
    onReset();
    router.push(`/feedback/${interviewId}`);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-12 text-center space-y-8 w-full">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground">
              Interview Completed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job! Your interview session has been successfully completed.
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground">
              Your performance has been evaluated and a detailed scorecard has
              been generated. You can view your results and feedback below.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleViewFeedback}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              View Feedback
            </button>
            <button
              onClick={handleGoToDashboard}
              className="px-8 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors shadow-md hover:shadow-lg cursor-pointer border border-border"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

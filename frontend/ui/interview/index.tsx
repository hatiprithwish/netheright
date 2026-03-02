"use client";

import { useInterviewSession } from "@/frontend/api/cachedQueries";
import * as Schemas from "@/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { InterviewCompletionScreen } from "./components/InterviewCompletionScreen";
import { InterviewInterface } from "./components/InterviewInterface";

export default function InterviewPage({
  problemId,
  sessionId,
}: {
  problemId: number;
  sessionId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data,
    isLoading,
    handleRefresh: mutate,
  } = useInterviewSession(sessionId ?? null);
  const session = data?.interview ?? null;

  const currentPhaseParam = searchParams.get("phase");
  const currentPhase = currentPhaseParam
    ? parseInt(currentPhaseParam)
    : (session?.currentPhase ??
      Schemas.InterviewPhaseIntEnum.RequirementsGathering);

  const handlePhaseChange = (newPhase: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("phase", String(newPhase));
    router.push(`?${params.toString()}`);
    mutate();
  };

  // Sync URL with phase if missing
  useEffect(() => {
    if (!currentPhaseParam && !isLoading && session?.currentPhase) {
      handlePhaseChange(currentPhase);
    }
  }, [currentPhaseParam, isLoading, session?.currentPhase, currentPhase]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-slate-600">Loading interview session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-slate-600">Session not found</div>
      </div>
    );
  }

  if (session.status === Schemas.InterviewStatusIntEnum.Completed) {
    return <InterviewCompletionScreen />;
  }

  return (
    <InterviewInterface
      key={currentPhase}
      sessionId={session.id}
      problemId={problemId}
      problemTitle={session.problemTitle}
      phase={currentPhase}
      onPhaseChange={handlePhaseChange}
      maxReachedPhase={session.currentPhase}
      onSessionRefresh={mutate}
    />
  );
}

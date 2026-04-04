"use client";

import { useGetInterview } from "@/frontend/api/cachedQueries";
import * as Schemas from "@/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { InterviewInterface } from "./InterviewInterface";

export default function InterviewPage({
  problemId,
  interviewId,
}: {
  problemId: number;
  interviewId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data,
    isLoading,
    handleRefresh: mutate,
  } = useGetInterview(interviewId ?? null);
  const session = data?.interview ?? null;

  const currentPhaseParam = searchParams.get("phase");
  const currentPhase = currentPhaseParam
    ? parseInt(currentPhaseParam)
    : (session?.currentPhase ??
      Schemas.InterviewPhaseIntEnum.RequirementsGathering);

  const handlePhaseChange = useCallback(
    (newPhase: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("phase", String(newPhase));
      router.push(`?${params.toString()}`);
      mutate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  // Sync URL with phase if missing
  useEffect(() => {
    if (!currentPhaseParam && !isLoading && session?.currentPhase) {
      handlePhaseChange(currentPhase);
    }
  }, [currentPhaseParam, isLoading, session?.currentPhase, currentPhase]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-slate-600">Loading interview...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-slate-600">Interview not found</div>
      </div>
    );
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

"use client";

import { useInterviewSession } from "@/frontend/api/cachedQueries";
import * as Schemas from "@/schemas";
import { useRouter, useSearchParams } from "next/navigation";
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

  const { session, isLoading } = useInterviewSession(sessionId ?? null);

  const currentPhase =
    session?.currentPhase ??
    Schemas.InterviewPhaseIntEnum.RequirementsGathering;

  const handlePhaseChange = (newPhase: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("phase", String(newPhase));
    router.push(`?${params.toString()}`);
  };

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
      phase={currentPhase}
      onPhaseChange={handlePhaseChange}
      maxReachedPhase={session.currentPhase}
    />
  );
}

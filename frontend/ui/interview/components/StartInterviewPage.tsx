"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "../zustand";
import { InterviewStart } from "./InterviewStart";

const DEFAULT_PROBLEM_ID = 1;

export function StartInterviewPage() {
  const router = useRouter();
  const setProblemId = useInterviewStore((state) => state.setProblemId);
  const sessionId = useInterviewStore((state) => state.sessionId);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setProblemId(DEFAULT_PROBLEM_ID);
    setIsInitialized(true);
  }, [setProblemId]);

  const handleSessionCreated = () => {
    if (sessionId) {
      router.push(`/interview/${DEFAULT_PROBLEM_ID}`);
    }
  };

  // Don't render InterviewStart until problemId is initialized
  if (!isInitialized) {
    return null;
  }

  return <InterviewStart onSessionCreated={handleSessionCreated} />;
}

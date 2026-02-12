"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "../zustand";
import { InterviewStart } from "./InterviewStart";

const DEFAULT_PROBLEM_ID = 1;

export function StartInterviewPage() {
  const router = useRouter();
  const setProblemId = useInterviewStore((state) => state.setProblemId);
  const sessionId = useInterviewStore((state) => state.sessionId);

  useEffect(() => {
    setProblemId(DEFAULT_PROBLEM_ID);
  }, [setProblemId]);

  const handleSessionCreated = () => {
    if (sessionId) {
      router.push(`/interview/${DEFAULT_PROBLEM_ID}`);
    }
  };

  return <InterviewStart onSessionCreated={handleSessionCreated} />;
}

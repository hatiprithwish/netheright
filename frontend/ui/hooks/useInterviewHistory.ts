"use client";

import { useEffect, useState } from "react";
import * as Schemas from "@/schemas";

export function useInterviewHistory() {
  const [interviews, setInterviews] = useState<Schemas.InterviewHistoryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/interviews");
        const data: Schemas.GetInterviewHistoryResponse = await response.json();

        if (data.isSuccess) {
          setInterviews(data.interviews);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch interview history");
        console.error("Error fetching interviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return { interviews, isLoading, error };
}

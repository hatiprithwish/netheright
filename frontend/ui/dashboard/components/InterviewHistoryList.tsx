import { InterviewCard } from "./InterviewCard";
import { FileText, Loader2 } from "lucide-react";
import * as Schemas from "@/schemas";

interface InterviewHistoryListProps {
  interviews: Schemas.InterviewHistoryItem[];
  isLoading: boolean;
}

export function InterviewHistoryList({
  interviews,
  isLoading,
}: InterviewHistoryListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-text-muted">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 max-w-md">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 w-fit mx-auto">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-text-main">
              No Interviews Yet
            </h3>
            <p className="text-text-muted">
              You haven't completed any interviews yet. Start your first
              interview to see your progress here.
            </p>
          </div>
          <a
            href="/interview"
            className="inline-block px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            Start Your First Interview
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview.sessionId} interview={interview} />
      ))}
    </div>
  );
}

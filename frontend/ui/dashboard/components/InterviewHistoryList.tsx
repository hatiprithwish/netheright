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
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-slate-600">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 max-w-md">
          <div className="rounded-full bg-slate-100 p-6 w-fit mx-auto">
            <FileText className="w-12 h-12 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">
              No Interviews Yet
            </h3>
            <p className="text-slate-600">
              You haven't completed any interviews yet. Start your first
              interview to see your progress here.
            </p>
          </div>
          <a
            href="/interview"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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

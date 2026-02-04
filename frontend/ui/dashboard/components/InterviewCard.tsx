import { GradeBadge } from "./GradeBadge";
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import * as Schemas from "@/schemas";

interface InterviewCardProps {
  interview: Schemas.InterviewHistoryItem;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (interview.status) {
      case 2: // Completed
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 1: // Active
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 3: // Abandoned
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (interview.status) {
      case 2: // Completed
        return "text-green-700 bg-green-50";
      case 1: // Active
        return "text-blue-700 bg-blue-50";
      case 3: // Abandoned
        return "text-red-700 bg-red-50";
      default:
        return "text-slate-700 bg-slate-50";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {interview.problemTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(interview.startTime)}</span>
          </div>
        </div>
        {interview.scorecard && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-medium text-slate-500">
              Overall Grade
            </span>
            <GradeBadge grade={interview.scorecard.overallGrade} size="lg" />
          </div>
        )}
      </div>

      {/* Scorecard Details */}
      {interview.scorecard && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Requirements</span>
            <GradeBadge
              grade={interview.scorecard.requirementsGathering}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Data Modeling</span>
            <GradeBadge grade={interview.scorecard.dataModeling} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Trade-offs</span>
            <GradeBadge
              grade={interview.scorecard.tradeOffAnalysis}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Scalability</span>
            <GradeBadge grade={interview.scorecard.scalability} size="sm" />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span>{interview.statusLabel}</span>
        </div>
        {interview.scorecard && (
          <button className="text-sm font-medium text-primary hover:underline">
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}

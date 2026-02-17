"use client";

import { GradeBadge } from "./GradeBadge";
import { FeedbackModal } from "./FeedbackModal";
import { Calendar, CheckCircle2, Clock, XCircle, Trash2 } from "lucide-react";
import * as Schemas from "@/schemas";
import { deleteInterview } from "@/frontend/api/mutations";
import { mutate } from "swr";
import { useState } from "react";

interface InterviewCardProps {
  interview: Schemas.InterviewHistoryItem;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInterview(interview.sessionId);
      await mutate("/api/dashboard/interviews");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete interview:", error);
      setIsDeleting(false);
    }
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

  const handleCardClick = () => {
    if (interview.scorecard) {
      setShowFeedbackModal(true);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 space-y-4`}
      >
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
          <div className="flex items-center gap-2">
            {interview.scorecard && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-slate-500">
                  Overall Grade
                </span>
                <GradeBadge
                  grade={interview.scorecard.overallGrade}
                  size="lg"
                />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete interview"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
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
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-sm cursor-pointer font-medium text-primary hover:underline"
            >
              View Details →
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Delete Interview?
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          sessionId={interview.sessionId}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </>
  );
}

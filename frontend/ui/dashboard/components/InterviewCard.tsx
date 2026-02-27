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
        return "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30";
      case 1: // Active
        return "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30";
      case 3: // Abandoned
        return "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30";
      default:
        return "text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800";
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
        className={`bg-card text-card-foreground rounded-xl border border-border shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all p-6 space-y-4 cursor-pointer group`}
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-brand-primary transition-colors">
              {interview.problemTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(interview.startTime)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {interview.scorecard && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Grade
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
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete interview"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scorecard Details */}
        {interview.scorecard && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Requirements</span>
              <GradeBadge
                grade={interview.scorecard.requirementsGathering}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Data Modeling</span>
              <GradeBadge grade={interview.scorecard.dataModeling} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Trade-offs</span>
              <GradeBadge
                grade={interview.scorecard.tradeOffAnalysis}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Scalability</span>
              <GradeBadge grade={interview.scorecard.scalability} size="sm" />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span>{interview.statusLabel}</span>
          </div>
          {interview.scorecard && (
            <span className="text-sm font-medium text-brand-primary group-hover:underline">
              View Details →
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-lg font-semibold mb-2">Delete Interview?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-secondary-foreground bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
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

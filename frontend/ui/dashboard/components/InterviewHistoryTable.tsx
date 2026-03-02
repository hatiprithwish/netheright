"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import * as Schemas from "@/schemas";
import { deleteInterview } from "@/frontend/api/mutations";
import { GradeBadge } from "./GradeBadge";
import { FeedbackModal } from "./FeedbackModal";
import { useRouter } from "next/navigation";

const COLUMNS = {
  id: "id",
  name: "name",
  performance: "performance",
  status: "status",
  date: "date",
  actions: "actions",
} as const;

const COLUMN_LABELS = {
  [COLUMNS.id]: "#",
  [COLUMNS.name]: "Name",
  [COLUMNS.performance]: "Overall Performance",
  [COLUMNS.status]: "Status",
  [COLUMNS.date]: "Date",
  [COLUMNS.actions]: "Actions",
} as const;

const SORTABLE_COLUMNS: Schemas.InterviewSortColumn[] = [
  Schemas.InterviewSortColumn.Id,
  Schemas.InterviewSortColumn.Status,
  Schemas.InterviewSortColumn.Date,
];

const COLUMN_SORT_MAP: Partial<Record<string, Schemas.InterviewSortColumn>> = {
  [COLUMNS.id]: Schemas.InterviewSortColumn.Id,
  [COLUMNS.status]: Schemas.InterviewSortColumn.Status,
  [COLUMNS.date]: Schemas.InterviewSortColumn.Date,
};

interface InterviewHistoryTableProps {
  interviews: Schemas.InterviewHistoryItem[];
  isLoading: boolean;
  page: number;
  sortBy: Schemas.InterviewSortColumn;
  sortOrder: Schemas.SortDirection;
  onPageChange: (page: number) => void;
  onSort: (
    sortBy: Schemas.InterviewSortColumn,
    sortOrder: Schemas.SortDirection,
  ) => void;
  onDeleteSuccess: () => void;
}

export function InterviewHistoryTable({
  interviews,
  isLoading,
  page,
  sortBy,
  sortOrder,
  onPageChange,
  onSort,
  onDeleteSuccess,
}: InterviewHistoryTableProps) {
  const router = useRouter();
  const [feedbackSessionId, setFeedbackSessionId] = useState<string | null>(
    null,
  );
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatShortId = (id: string) => id.slice(-8).toUpperCase();

  const handleSortClick = (colKey: string) => {
    const colSortBy = COLUMN_SORT_MAP[colKey];
    if (!colSortBy) return;

    if (sortBy === colSortBy) {
      onSort(
        colSortBy,
        sortOrder === Schemas.SortDirection.Asc
          ? Schemas.SortDirection.Desc
          : Schemas.SortDirection.Asc,
      );
    } else {
      onSort(colSortBy, Schemas.SortDirection.Desc);
    }
    onPageChange(1);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteInterview(deleteTargetId);
      setDeleteTargetId(null);
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete interview:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSortIcon = (colKey: string) => {
    const colSortBy = COLUMN_SORT_MAP[colKey];
    if (!colSortBy) return null;

    if (sortBy !== colSortBy) {
      return (
        <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
      );
    }
    return sortOrder === Schemas.SortDirection.Asc ? (
      <ChevronUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  const getStatusBadge = (interview: Schemas.InterviewHistoryItem) => {
    switch (interview.status) {
      case Schemas.InterviewStatusIntEnum.Completed:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {interview.statusLabel}
          </span>
        );
      case Schemas.InterviewStatusIntEnum.Active:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            {interview.statusLabel}
          </span>
        );
      case Schemas.InterviewStatusIntEnum.Abandoned:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" />
            {interview.statusLabel}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
            {interview.statusLabel}
          </span>
        );
    }
  };

  const COLUMN_KEYS = Object.values(COLUMNS);

  if (!isLoading && interviews.length === 0 && page === 1) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 max-w-md">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 w-fit mx-auto">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              No Interviews Yet
            </h3>
            <p className="text-muted-foreground">
              You haven&apos;t completed any interviews yet. Start your first
              interview to see your progress here.
            </p>
          </div>
          <a
            href="/problems"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Your First Interview
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {COLUMN_KEYS.map((colKey) => {
                  const isSortable = colKey in COLUMN_SORT_MAP;
                  return (
                    <th
                      key={colKey}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${
                        isSortable
                          ? "cursor-pointer select-none hover:text-foreground transition-colors"
                          : ""
                      }`}
                      onClick={() => isSortable && handleSortClick(colKey)}
                    >
                      <div className="flex items-center gap-1">
                        {COLUMN_LABELS[colKey as keyof typeof COLUMN_LABELS]}
                        {renderSortIcon(colKey)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {COLUMN_KEYS.map((colKey) => (
                        <td key={colKey} className="px-4 py-3">
                          <div className="h-4 bg-secondary rounded w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                : interviews.map((interview) => (
                    <tr
                      key={interview.sessionId}
                      className={`transition-colors hover:bg-secondary/30 ${
                        interview.scorecard
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() => {
                        if (interview.scorecard) {
                          setFeedbackSessionId(interview.sessionId);
                        }
                      }}
                    >
                      {/* # */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {formatShortId(interview.sessionId)}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                          {interview.problemTitle}
                        </span>
                      </td>

                      {/* Overall Performance */}
                      <td className="px-4 py-3">
                        {interview.scorecard ? (
                          <GradeBadge
                            grade={interview.scorecard.overallGrade}
                            size="sm"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">{getStatusBadge(interview)}</td>

                      {/* Date */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(interview.startTime)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              router.push(`/problems/${interview.problemId}`)
                            }
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Retest"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTargetId(interview.sessionId)
                            }
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && interviews.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/10">
            <p className="text-xs text-muted-foreground">Page {page}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={interviews.length < 10}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-lg font-semibold mb-2">Delete Interview?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-secondary-foreground bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-destructive hover:bg-destructive/90 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
      {feedbackSessionId && (
        <FeedbackModal
          sessionId={feedbackSessionId}
          onClose={() => setFeedbackSessionId(null)}
        />
      )}
    </>
  );
}

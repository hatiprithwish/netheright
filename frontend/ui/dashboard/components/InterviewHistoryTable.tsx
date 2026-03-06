"use client";

import { useState } from "react";
import { Trash2, Loader2, FileText } from "lucide-react";
import * as Schemas from "@/schemas";
import { deleteInterview } from "@/frontend/api/mutations";
import { GradeBadge } from "./GradeBadge";
import { FeedbackModal } from "./FeedbackModal";
import { AppTable } from "@/frontend/ui/common/components/AppTable";
import { AppTablePagination } from "@/frontend/ui/common/components/AppTable/AppTablePagination";
import { AppTableColumn } from "@/frontend/ui/common/components/AppTable/AppTable.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const EMPTY_STATE = (
  <div className="flex flex-col items-center gap-4 py-4">
    <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
      <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
    </div>
    <div className="space-y-2 text-center">
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
      className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Start Your First Interview
    </a>
  </div>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface InterviewHistoryTableProps {
  interviews: Schemas.Interview[];
  totalRecords: number;
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
  onRefresh?: () => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InterviewHistoryTable({
  interviews,
  totalRecords,
  isLoading,
  page,
  sortBy,
  sortOrder,
  onPageChange,
  onSort,
  onDeleteSuccess,
  onRefresh,
}: InterviewHistoryTableProps) {
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

  const handleSort = (col: string, dir: string) => {
    onSort(col as Schemas.InterviewSortColumn, dir as Schemas.SortDirection);
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

  const getStatusBadge = (interview: Schemas.Interview) => {
    switch (interview.status) {
      case Schemas.InterviewStatusIntEnum.Completed:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            {interview.statusLabel}
          </span>
        );
      case Schemas.InterviewStatusIntEnum.Active:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            {interview.statusLabel}
          </span>
        );
      case Schemas.InterviewStatusIntEnum.Abandoned:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
            {interview.statusLabel}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
            {interview.statusLabel}
          </span>
        );
    }
  };

  const columns: AppTableColumn<Schemas.Interview>[] = [
    {
      key: "id",
      header: "#",
      cell: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatShortId(row.id)}
        </span>
      ),
    },
    {
      key: "problemTitle",
      header: "Name",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.problemTitle}</span>
      ),
    },
    {
      key: "performance",
      header: "Overall Performance",
      cell: (row) =>
        row.overallGrade ? (
          <GradeBadge grade={row.overallGrade} size="sm" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortKey: Schemas.InterviewSortColumn.Status,
      cell: (row) => getStatusBadge(row),
    },
    {
      key: "startTime",
      header: "Date",
      sortKey: Schemas.InterviewSortColumn.createdAt,
      cell: (row) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTargetId(row.id);
          }}
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ];

  return (
    <>
      <AppTable<Schemas.Interview>
        columns={columns}
        data={interviews}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        skeletonRows={ITEMS_PER_PAGE}
        // emptyState={EMPTY_STATE}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(row) => {
          if (row.overallGrade) {
            setFeedbackSessionId(row.id);
          }
        }}
        getRowClassName={(row) =>
          row.overallGrade ? "cursor-pointer" : "cursor-default"
        }
      />

      <AppTablePagination
        totalRecords={totalRecords}
        currentPage={page}
        itemsPerPage={ITEMS_PER_PAGE}
        onPrev={() => onPageChange(page - 1)}
        onNext={() => onPageChange(page + 1)}
        onJumpToPage={onPageChange}
        isLoading={isLoading}
        onRefresh={onRefresh}
        showJumpButtons
      />

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl">
            <h3 className="mb-2 text-lg font-semibold">Delete Interview?</h3>
            <p className="mb-6 text-muted-foreground">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="cursor-pointer rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-destructive px-4 py-2 font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
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

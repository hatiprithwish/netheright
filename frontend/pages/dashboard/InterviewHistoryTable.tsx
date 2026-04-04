"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import * as Schemas from "@/schemas";
import { deleteInterview } from "@/frontend/api/mutations";
import { GradeBadge } from "./GradeBadge";
import { AppTable } from "@/frontend/components/app-table";
import { AppTablePagination } from "@/frontend/components/app-table/AppTablePagination";
import { AppTableColumn } from "@/frontend/components/app-table/AppTable.types";
import { cn } from "@/lib/utils";
import Utilities from "@/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/frontend/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/components/shadcn/tooltip";
import { ConfirmationModal } from "@/frontend/components/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

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

function InterviewHistoryTable({
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
  const router = useRouter();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
          Utilities.getBadgeColor(
            Schemas.InterviewStatusLabelToBadgeColor[interview.statusLabel],
          ),
        )}
      >
        {interview.statusLabel}
      </span>
    );
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
      sortKey: Schemas.InterviewSortColumn.CreatedAt,
      cell: (row) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {row.createdAt ? Utilities.formatDate(row.createdAt.toString()) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTargetId(row.id);
              }}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Interview</TooltipContent>
        </Tooltip>
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(row) => {
          router.push(`/feedback/${row.id}`);
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Interview?"
        description="Are you sure you want to delete this interview? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}

export default InterviewHistoryTable;

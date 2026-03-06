"use client";

import { useEffect, useState } from "react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AppTablePaginationProps } from "./AppTable.types";
import {
  PAGINATION_LABELS,
  PAGINATION_NAV_BTN_CLASS,
  computePaginationDisplay,
} from "./utils";

// ─── Page Number Input ────────────────────────────────────────────────────────

interface PageInputProps {
  currentPage: number;
  totalPages: number;
  onJumpToPage: (page: number) => void;
  isDisabled?: boolean;
}

function PageInput({
  currentPage,
  totalPages,
  onJumpToPage,
  isDisabled,
}: PageInputProps) {
  const [inputValue, setInputValue] = useState(String(currentPage));

  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  return (
    <input
      type="number"
      min={1}
      max={totalPages}
      value={inputValue}
      disabled={isDisabled}
      className="h-8 w-14 rounded-md border border-border bg-card px-2 text-center text-xs text-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const parsed = parseInt(inputValue, 10);
          if (parsed >= 1 && parsed <= totalPages) {
            onJumpToPage(parsed);
          }
        }
      }}
      onBlur={() => setInputValue(String(currentPage))}
    />
  );
}

// ─── AppTablePagination ───────────────────────────────────────────────────────

export function AppTablePagination({
  totalRecords,
  currentPage,
  itemsPerPage,
  onPrev,
  onNext,
  onJumpToPage,
  isLoading,
  onRefresh,
  showJumpButtons = false,
  showPageSizeController = false,
  pageSizeOptions = [],
  selectedPageSize,
  onPageSizeChange,
  className,
}: AppTablePaginationProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { totalPages, lowerLimit, upperLimit, isFirst, isLast } =
    computePaginationDisplay(totalRecords, currentPage, itemsPerPage);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border bg-secondary/10 px-4 py-2.5",
        className,
      )}
    >
      {/* ─── Left: count info + page size + refresh ──────────────────────── */}
      <div className="flex items-center gap-3">
        {showPageSizeController && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:block">
              {PAGINATION_LABELS.itemsPerPage}
            </span>
            <select
              value={selectedPageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              disabled={isLoading}
              className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {PAGINATION_LABELS.showing}{" "}
          <span className="font-medium text-foreground">{lowerLimit}</span>{" "}
          {PAGINATION_LABELS.to}{" "}
          <span className="font-medium text-foreground">{upperLimit}</span>{" "}
          {PAGINATION_LABELS.of}{" "}
          <span className="font-medium text-foreground">{totalRecords}</span>{" "}
          {PAGINATION_LABELS.results}
        </p>

        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
            />
          </button>
        )}
      </div>

      {/* ─── Right: nav controls ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {showJumpButtons && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onJumpToPage?.(1)}
                disabled={isFirst || isLoading}
                className={PAGINATION_NAV_BTN_CLASS}
              >
                <ChevronFirst className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {PAGINATION_LABELS.first}
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onPrev}
              disabled={isFirst || isLoading}
              className={PAGINATION_NAV_BTN_CLASS}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {PAGINATION_LABELS.prev}
          </TooltipContent>
        </Tooltip>

        {/* Page number input + "of N" */}
        <div className="flex items-center gap-1.5">
          {onJumpToPage ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <PageInput
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onJumpToPage={onJumpToPage}
                    isDisabled={isLoading}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {PAGINATION_LABELS.jumpInput}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-md border border-border bg-card px-2.5 text-xs font-medium">
              {currentPage}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {PAGINATION_LABELS.ofPages} {totalPages}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onNext}
              disabled={isLast || isLoading}
              className={PAGINATION_NAV_BTN_CLASS}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {PAGINATION_LABELS.next}
          </TooltipContent>
        </Tooltip>

        {showJumpButtons && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onJumpToPage?.(totalPages)}
                disabled={isLast || isLoading}
                className={PAGINATION_NAV_BTN_CLASS}
              >
                <ChevronLast className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {PAGINATION_LABELS.last}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

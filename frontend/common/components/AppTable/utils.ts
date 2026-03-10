import { AppTableColumn } from "./AppTable.types";

// ─── CSS Class Constants ──────────────────────────────────────────────────────

export const TABLE_WRAPPER_CLASS =
  "rounded-xl border border-border bg-card overflow-hidden shadow-soft";

export const HEADER_ROW_CLASS =
  "border-b border-border bg-secondary/30 hover:bg-secondary/30";

export const SORT_ICON_INACTIVE_CLASS = "h-3.5 w-3.5 text-muted-foreground/50";

export const SORT_ICON_ACTIVE_CLASS = "h-3.5 w-3.5 text-primary";

export const DRAG_HANDLE_CLASS =
  "mr-1.5 h-3.5 w-3.5 cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing";

export const SKELETON_CELL_CLASS = "h-4 animate-pulse rounded bg-secondary";

export const FOOTER_ROW_CLASS =
  "sticky bottom-0 z-10 border-t border-border bg-card font-medium";

export const PAGINATION_NAV_BTN_CLASS =
  "flex h-8 cursor-pointer items-center justify-center rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40";

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_SKELETON_ROWS = 5;

export const DEFAULT_EMPTY_TITLE = "No records found.";

// ─── Pagination Labels ────────────────────────────────────────────────────────

export const PAGINATION_LABELS = {
  first: "Go to first page",
  prev: "Previous page",
  next: "Next page",
  last: "Go to last page",
  jumpInput: "Go to page",
  itemsPerPage: "Items per page",
  showing: "Showing",
  to: "to",
  of: "of",
  results: "results",
  ofPages: "of",
} as const;

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Resolves the ordered, visible column list from a columnOrder array.
 * Preserves the drag-reordered sequence while guarding against stale keys.
 */
export function resolveVisibleColumns<TRow>(
  columns: AppTableColumn<TRow>[],
  columnOrder: string[],
): AppTableColumn<TRow>[] {
  return columnOrder
    .map((key) => columns.find((c) => c.key === key))
    .filter(Boolean) as AppTableColumn<TRow>[];
}

/**
 * Computes pagination display values from raw pagination state.
 */
export function computePaginationDisplay(
  totalRecords: number,
  currentPage: number,
  itemsPerPage: number,
) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const lowerLimit = totalRecords ? itemsPerPage * (currentPage - 1) + 1 : 0;
  const upperLimit = Math.min(itemsPerPage * currentPage, totalRecords);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return { totalPages, lowerLimit, upperLimit, isFirst, isLast };
}

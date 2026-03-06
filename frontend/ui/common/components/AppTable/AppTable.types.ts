import { ReactNode } from "react";

export interface AppTableColumn<TRow> {
  /** Unique identifier for the column */
  key: string;
  /** Column header label */
  header: string;
  /** If set, clicking the header will call onSort with this key */
  sortKey?: string;
  /** If true, column is excluded from rendering */
  hidden?: boolean;
  /** Tooltip shown on the column header (info icon) */
  headerTooltip?: string;
  /** Custom cell renderer — overrides default value display */
  cell?: (row: TRow) => ReactNode;
  /** Footer cell renderer — receives all visible data rows */
  footer?: (data: TRow[]) => ReactNode;
  /** Extra className applied to every <td> in this column */
  className?: string;
  /** Extra className applied to the <th> for this column */
  headerClassName?: string;
}

export type AppTableSortDirection = "asc" | "desc";

export interface AppTableProps<TRow> {
  /** Column definitions */
  columns: AppTableColumn<TRow>[];
  /** Row data */
  data: TRow[];
  /** Returns a unique string key per row */
  keyExtractor: (row: TRow) => string;

  // ─── States ──────────────────────────────────────────────────────────────
  /** Shows animated skeleton rows while true */
  isLoading?: boolean;
  /** How many skeleton rows to show (default: 5) */
  skeletonRows?: number;
  /** Custom empty state node — rendered when data is empty and not loading */
  emptyState?: ReactNode;
  /** Error message shown spanning all columns in the table body */
  errorMsg?: string;

  // ─── Sorting (server-side) ────────────────────────────────────────────────
  /** Currently active sort column key */
  sortBy?: string;
  /** Currently active sort direction */
  sortOrder?: AppTableSortDirection;
  /** Called when a sortable column header is clicked */
  onSort?: (col: string, dir: AppTableSortDirection) => void;

  // ─── Row interaction ──────────────────────────────────────────────────────
  /** Called when a data row is clicked */
  onRowClick?: (row: TRow) => void;
  /** Returns extra className(s) for a given row */
  getRowClassName?: (row: TRow) => string;

  // ─── Layout ───────────────────────────────────────────────────────────────
  /** Fixes the thead at the top when the table container scrolls */
  stickyHeader?: boolean;

  // ─── Footer ───────────────────────────────────────────────────────────────
  /** Renders a <tfoot> row when true and at least one column has a footer fn */
  showFooter?: boolean;
}

export interface AppTablePaginationProps {
  /** Total number of records (from the count API) */
  totalRecords: number;
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  itemsPerPage: number;
  /** Go to previous page */
  onPrev: () => void;
  /** Go to next page */
  onNext: () => void;
  /** Jump directly to a specific page number */
  onJumpToPage?: (page: number) => void;
  /** Disables all controls while true */
  isLoading?: boolean;
  /** Shows a refresh button that calls this async fn */
  onRefresh?: () => Promise<void>;
  /** Shows |<< first and last >>| jump buttons */
  showJumpButtons?: boolean;
  /** Shows a page-size dropdown */
  showPageSizeController?: boolean;
  pageSizeOptions?: { value: number; label: string }[];
  selectedPageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

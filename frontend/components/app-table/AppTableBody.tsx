import { cn } from "@/lib/utils";
import { AppTableColumn } from "./AppTable.types";
import { AppTableEmpty } from "./AppTableEmpty";
import { ReactNode } from "react";
import {
  DEFAULT_SKELETON_ROWS,
  SKELETON_CELL_CLASS,
  resolveVisibleColumns,
} from "./utils";
import { TableBody, TableCell, TableRow } from "../shadcn/table";

interface AppTableBodyProps<TRow> {
  columns: AppTableColumn<TRow>[];
  columnOrder: string[];
  data: TRow[];
  keyExtractor: (row: TRow) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyState?: ReactNode;
  errorMsg?: string;
  onRowClick?: (row: TRow) => void;
  getRowClassName?: (row: TRow) => string;
}

export function AppTableBody<TRow>({
  columns,
  columnOrder,
  data,
  keyExtractor,
  isLoading,
  skeletonRows = DEFAULT_SKELETON_ROWS,
  emptyState,
  errorMsg,
  onRowClick,
  getRowClassName,
}: AppTableBodyProps<TRow>) {
  const visibleColumns = resolveVisibleColumns(columns, columnOrder);

  // ── Error state ──────────────────────────────────────────────────────────
  if (!isLoading && errorMsg) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={visibleColumns.length}
            className="py-10 text-center text-sm text-destructive"
          >
            {errorMsg}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
          <TableRow key={rowIdx} className="border-0 hover:bg-transparent">
            {visibleColumns.map((col) => (
              <TableCell
                key={col.key}
                className={cn("px-4 py-3", col.className)}
              >
                <div className={SKELETON_CELL_CLASS} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <TableBody>
        <AppTableEmpty
          colCount={visibleColumns.length}
          emptyState={emptyState}
        />
      </TableBody>
    );
  }

  // ── Data rows ─────────────────────────────────────────────────────────────
  return (
    <TableBody>
      {data.map((row) => {
        const rowKey = keyExtractor(row);
        const extraClass = getRowClassName?.(row) ?? "";
        const isClickable = !!onRowClick;

        return (
          <TableRow
            key={rowKey}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "border-0 transition-colors hover:bg-secondary/30",
              isClickable && "cursor-pointer",
              extraClass,
            )}
          >
            {visibleColumns.map((col) => {
              const rawValue = (row as Record<string, unknown>)[col.key];
              const displayValue = rawValue != null ? String(rawValue) : "";

              return (
                <TableCell
                  key={col.key}
                  className={cn("px-4 py-3", col.className)}
                >
                  {col.cell ? (
                    col.cell(row)
                  ) : (
                    /* Cell overflow tooltip via native title */
                    <span
                      className="block max-w-[240px] truncate"
                      title={displayValue}
                    >
                      {displayValue}
                    </span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

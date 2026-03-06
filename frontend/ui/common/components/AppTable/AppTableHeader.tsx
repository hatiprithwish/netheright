"use client";

import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  GripVertical,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppTableColumn, AppTableSortDirection } from "./AppTable.types";
import { cn } from "@/lib/utils";
import {
  HEADER_ROW_CLASS,
  SORT_ICON_INACTIVE_CLASS,
  SORT_ICON_ACTIVE_CLASS,
  DRAG_HANDLE_CLASS,
} from "./utils";

export { arrayMove };

// ─── Sortable Header Cell ──────────────────────────────────────────────────

interface SortableHeaderCellProps<TRow> {
  column: AppTableColumn<TRow>;
  sortBy?: string;
  sortOrder?: AppTableSortDirection;
  onSort?: (col: string, dir: AppTableSortDirection) => void;
  stickyHeader?: boolean;
}

function SortableHeaderCell<TRow>({
  column,
  sortBy,
  sortOrder,
  onSort,
}: SortableHeaderCellProps<TRow>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSortable = !!column.sortKey && !!onSort;
  const isActive = column.sortKey === sortBy;

  const handleSortClick = () => {
    if (!isSortable || !column.sortKey) return;
    if (isActive) {
      onSort!(column.sortKey, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort!(column.sortKey, "desc");
    }
  };

  const SortIcon = () => {
    if (!isSortable) return null;
    if (!isActive)
      return <ChevronsUpDown className={SORT_ICON_INACTIVE_CLASS} />;
    return sortOrder === "asc" ? (
      <ChevronUp className={SORT_ICON_ACTIVE_CLASS} />
    ) : (
      <ChevronDown className={SORT_ICON_ACTIVE_CLASS} />
    );
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        "h-auto select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        isSortable && "cursor-pointer hover:text-foreground transition-colors",
        column.headerClassName,
      )}
      onClick={handleSortClick}
    >
      <div className="flex items-center gap-1">
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className={DRAG_HANDLE_CLASS}
          suppressHydrationWarning
        >
          <GripVertical className="h-3.5 w-3.5" />
        </span>

        {column.header}

        <SortIcon />

        {/* Header info tooltip */}
        {column.headerTooltip && (
          <Tooltip>
            <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              {column.headerTooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TableHead>
  );
}

// ─── AppTableHeader ─────────────────────────────────────────────────────────

interface AppTableHeaderProps<TRow> {
  columns: AppTableColumn<TRow>[];
  columnOrder: string[];
  sortBy?: string;
  sortOrder?: AppTableSortDirection;
  onSort?: (col: string, dir: AppTableSortDirection) => void;
  stickyHeader?: boolean;
}

export function AppTableHeader<TRow>({
  columns,
  columnOrder,
  sortBy,
  sortOrder,
  onSort,
  stickyHeader,
}: AppTableHeaderProps<TRow>) {
  const orderedColumns = columnOrder
    .map((key) => columns.find((c) => c.key === key))
    .filter(Boolean) as AppTableColumn<TRow>[];

  return (
    <SortableContext
      items={columnOrder}
      strategy={horizontalListSortingStrategy}
    >
      <TableHeader>
        <TableRow
          className={cn(HEADER_ROW_CLASS, stickyHeader && "sticky top-0 z-10")}
        >
          {orderedColumns.map((column) => (
            <SortableHeaderCell
              key={column.key}
              column={column}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
              stickyHeader={stickyHeader}
            />
          ))}
        </TableRow>
      </TableHeader>
    </SortableContext>
  );
}

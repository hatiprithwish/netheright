import { TableCell, TableRow } from "../shadcn/table";
import { AppTableColumn } from "./AppTable.types";
import { cn } from "@/lib/utils";
import { FOOTER_ROW_CLASS, resolveVisibleColumns } from "./utils";

interface AppTableFooterProps<TRow> {
  columns: AppTableColumn<TRow>[];
  columnOrder: string[];
  data: TRow[];
}

export function AppTableFooter<TRow>({
  columns,
  columnOrder,
  data,
}: AppTableFooterProps<TRow>) {
  const visibleColumns = resolveVisibleColumns(columns, columnOrder);

  const hasFooterCell = visibleColumns.some((col) => !!col.footer);
  if (!hasFooterCell) return null;

  return (
    <tfoot>
      <TableRow className={cn(FOOTER_ROW_CLASS, "hover:bg-card")}>
        {visibleColumns.map((col) => (
          <TableCell key={col.key} className={cn("px-4 py-3", col.className)}>
            {col.footer ? col.footer(data) : null}
          </TableCell>
        ))}
      </TableRow>
    </tfoot>
  );
}

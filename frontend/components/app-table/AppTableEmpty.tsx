import { TerminalIcon } from "lucide-react";
import { ReactNode } from "react";

const DEFAULT_EMPTY_TITLE = "No records found.";

interface AppTableEmptyProps {
  colCount: number;
  emptyState?: ReactNode;
}

export function AppTableEmpty({ colCount, emptyState }: AppTableEmptyProps) {
  return (
    <tr>
      <td colSpan={colCount} className="py-16 text-center">
        {emptyState ?? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="rounded-full bg-secondary p-4">
              <TerminalIcon className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">{DEFAULT_EMPTY_TITLE}</p>
          </div>
        )}
      </td>
    </tr>
  );
}

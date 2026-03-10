"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Table } from "@/frontend/components/ui/table";
import { AppTableProps } from "./AppTable.types";
import { AppTableHeader } from "./AppTableHeader";
import { AppTableBody } from "./AppTableBody";
import { AppTableFooter } from "./AppTableFooter";
import { cn } from "@/lib/utils";
import { TABLE_WRAPPER_CLASS } from "./utils";

export function AppTable<TRow>({
  columns,
  data,
  keyExtractor,
  isLoading,
  skeletonRows,
  emptyState,
  errorMsg,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  getRowClassName,
  stickyHeader,
  showFooter,
}: AppTableProps<TRow>) {
  const visibleColumns = columns.filter((c) => !c.hidden);
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    visibleColumns.map((c) => c.key),
  );

  // Sensors live here so DndContext can stay outside <table>
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = columnOrder.indexOf(active.id as string);
      const newIdx = columnOrder.indexOf(over.id as string);
      setColumnOrder(arrayMove(columnOrder, oldIdx, newIdx));
    }
  };

  return (
    // DndContext wraps the outer div — NOT inside <table> — so no hydration error
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={TABLE_WRAPPER_CLASS}>
        <div
          className={cn(
            "overflow-x-auto",
            stickyHeader && "overflow-y-auto max-h-[600px]",
          )}
        >
          <Table>
            <AppTableHeader
              columns={visibleColumns}
              columnOrder={columnOrder}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
              stickyHeader={stickyHeader}
            />

            <AppTableBody
              columns={visibleColumns}
              columnOrder={columnOrder}
              data={data}
              keyExtractor={keyExtractor}
              isLoading={isLoading}
              skeletonRows={skeletonRows}
              emptyState={emptyState}
              errorMsg={errorMsg}
              onRowClick={onRowClick}
              getRowClassName={getRowClassName}
            />

            {showFooter && (
              <AppTableFooter
                columns={visibleColumns}
                columnOrder={columnOrder}
                data={data}
              />
            )}
          </Table>
        </div>
      </div>
    </DndContext>
  );
}

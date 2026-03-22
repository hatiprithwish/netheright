import { create } from "zustand";
import * as Schemas from "@/schemas";
import Constants from "@/constants";

interface DashboardStore {
  pageNo: number;
  sortBy: Schemas.InterviewSortColumn;
  sortOrder: Schemas.SortDirection;
  setPageNo: (pageNo: number) => void;
  setSortBy: (sortBy: Schemas.InterviewSortColumn) => void;
  setSortOrder: (sortOrder: Schemas.SortDirection) => void;
  setSort: (
    sortBy: Schemas.InterviewSortColumn,
    sortOrder: Schemas.SortDirection,
  ) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  pageNo: Constants.DEFAULT_PAGE_NO,
  sortBy: Schemas.InterviewSortColumn.CreatedAt,
  sortOrder: Schemas.SortDirection.Desc,
  setPageNo: (pageNo) => set({ pageNo }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}));

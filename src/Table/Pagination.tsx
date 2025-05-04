import type { Table } from "@tanstack/react-table";
import styles from "./index.module.css";

type PaginationProps<TData> = {
  table: Table<TData>;
};

export const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        type="button"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <span>
        ページ{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount() === -1 ? "?" : table.getPageCount()}
        </strong>
      </span>
      <button
        type="button"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        type="button"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            表示件数: {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

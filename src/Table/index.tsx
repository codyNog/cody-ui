import { flexRender } from "@tanstack/react-table";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";
import { Pagination } from "./Pagination";
import { useTable } from "./hooks";
import styles from "./index.module.css";
import type { DataWithId, TableProps } from "./types";

/**
 * Table component that displays data in a tabular format.
 * It supports features like sorting, pagination, row/column reordering, and CSV download.
 * Built using `@tanstack/react-table` for core table logic and `@dnd-kit` for drag-and-drop functionality.
 *
 * @template TData - The type of the data for each row, which must extend `DataWithId`.
 * @param props - The properties for the Table component.
 */
export const Table = <TData extends DataWithId>(props: TableProps<TData>) => {
  const {
    table,
    sensors,
    handleDragEnd,
    rowIds,
    columnIds,
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    CSS,
    DndContext,
    closestCenter,
    isDownloadingCsv,
    handleCsvDownload,
  } = useTable(props);

  const {
    className,
    caption,
    isLoading,
    isError,
    noDataMessage = "データがありません",
    onRowOrderChange,
    onColumnOrderChange,
    onPaginationChange,
    onCsvDownloadRequest,
    filter,
  } = props;

  const showPagination =
    onPaginationChange &&
    table.options.pageCount !== undefined &&
    table.options.pageCount > 0;

  const colSpan = table.getAllColumns().length + (onRowOrderChange ? 1 : 0);
  const rows = table.getRowModel().rows;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={className}>
        {filter?.map((filter) => (
          <Chip key={filter.key} variant="filter" isSelected={!!filter.value}>
            {filter.type === "dateRange" && String(filter.value)}
            {filter.type === "boolean" && String(filter.value)}
            {filter.type === "date" && String(filter.value)}
            {filter.type === "number" && String(filter.value)}
            {filter.type === "text" && String(filter.value)}
          </Chip>
        ))}
        <table className={styles.table}>
          {caption && <caption>{caption}</caption>}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {onRowOrderChange && <th style={{ width: "40px" }} />}
                {onColumnOrderChange ? (
                  <SortableContext
                    items={columnIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    {columnIds.map((columnId) => {
                      const header = headerGroup.headers.find(
                        (h) => h.id === columnId,
                      );
                      if (!header || header.isPlaceholder) return null;
                      return (
                        <DraggableHeader
                          key={header.id}
                          header={header}
                          CSS={CSS}
                        />
                      );
                    })}
                  </SortableContext>
                ) : (
                  headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading && !isDownloadingCsv && (
              <tr>
                <td colSpan={colSpan}>ローディング中...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={colSpan}>エラーが発生しました。</td>
              </tr>
            )}
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {rows.length === 0 && !isLoading && !isError && (
                <tr>
                  <td colSpan={colSpan}>{noDataMessage}</td>
                </tr>
              )}
              {rows.map((row) => {
                if (onRowOrderChange)
                  return (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      columnIds={columnIds}
                    />
                  );

                return (
                  <tr key={row.id}>
                    {columnIds.map((columnId) => {
                      const cell = row
                        .getVisibleCells()
                        .find((c) => c.column.id === columnId);
                      if (!cell) return null;
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </SortableContext>
          </tbody>
        </table>
        {(onCsvDownloadRequest || showPagination) && (
          <div>
            {onCsvDownloadRequest && (
              <Button
                onClick={handleCsvDownload}
                isDisabled={isDownloadingCsv || isLoading}
              >
                {isDownloadingCsv ? "ダウンロード中..." : "CSVダウンロード"}
              </Button>
            )}
            {showPagination && <Pagination table={table} />}
          </div>
        )}
      </div>
    </DndContext>
  );
};

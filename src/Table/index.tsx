import { flexRender } from "@tanstack/react-table";
import { Button } from "../Button"; // Button をインポート
import { Chip } from "../Chip";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";
import { Pagination } from "./Pagination";
import { useTable } from "./hooks"; // useTable をインポート
import styles from "./index.module.css";
import type { DataWithId, TableProps } from "./types";
// 不要になったインポートを削除: unparse, format, useCallback

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
    isDownloadingCsv, // フックから取得
    handleCsvDownload, // フックから取得
  } = useTable(props); // useTable フックを使用

  // props から必要な値を取得
  const {
    className,
    caption,
    isLoading, // テーブル自体のローディング状態
    isError,
    noDataMessage = "データがありません",
    onRowOrderChange,
    onColumnOrderChange,
    onPaginationChange,
    onCsvDownloadRequest, // ボタン表示の判定に使用
    filter,
  } = props;

  // ページネーションが必要かどうかを判断
  const showPagination =
    onPaginationChange &&
    table.options.pageCount !== undefined &&
    table.options.pageCount > 0;

  // カラム数を計算
  const colSpan = table.getAllColumns().length + (onRowOrderChange ? 1 : 0);
  const rows = table.getRowModel().rows;

  // 不要になった downloadCsv 関数を削除

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
            {/* テーブル自体のローディング表示 */}
            {isLoading &&
              !isDownloadingCsv && ( // CSVダウンロード中は何もしない
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
        {/* フッター: CSVダウンロードボタンとページネーション */}
        {(onCsvDownloadRequest || showPagination) && ( // どちらかがあればフッター表示
          <div>
            {/* CSVダウンロードボタン */}
            {onCsvDownloadRequest && (
              <Button
                onClick={handleCsvDownload}
                isDisabled={isDownloadingCsv || isLoading} // CSVダウンロード中かテーブル読み込み中は無効
              >
                {isDownloadingCsv ? "ダウンロード中..." : "CSVダウンロード"}
              </Button>
            )}
            {/* ページネーション */}
            {showPagination && <Pagination table={table} />}
          </div>
        )}
      </div>
    </DndContext>
  );
};

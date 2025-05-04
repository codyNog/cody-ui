import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, useCallback } from "react"; // useState, useCallback をインポート
import { unparse } from "papaparse"; // papaparse をインポート
import { format } from "date-fns"; // date-fns をインポート
import type { TableProps, DataWithId } from "../types";

const defaultGetRowId = <TData extends DataWithId>(row: TData) => `${row.id}`;

export const useTable = <TData extends DataWithId>(
  props: TableProps<TData>,
) => {
  const {
    data,
    columns,
    operationMode = "server",
    pagination,
    sorting,
    columnFilters,
    globalFilter,
    rowSelection,
    columnVisibility,
    columnOrder: controlledColumnOrder,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onRowSelectionChange,
    onColumnVisibilityChange,
    onColumnOrderChange,
    onRowOrderChange,
    onCsvDownloadRequest, // CSVダウンロードリクエストハンドラを取得
    pageCount: controlledPageCount,
    totalRowCount,
    getRowId = defaultGetRowId,
  } = props;

  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false); // CSVダウンロード中状態

  const pageCount =
    operationMode === "server"
      ? (controlledPageCount ??
        (totalRowCount !== undefined && pagination?.pageSize
          ? Math.ceil(totalRowCount / pagination.pageSize)
          : -1))
      : undefined;

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
      columnOrder: controlledColumnOrder,
    },
    manualPagination: operationMode === "server",
    pageCount: pageCount,
    onPaginationChange,
    manualSorting: operationMode === "server" && !!onSortingChange,
    onSortingChange,
    manualFiltering: operationMode === "server" && !!onColumnFiltersChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    enableRowSelection: !!onRowSelectionChange,
    onRowSelectionChange,
    onColumnVisibilityChange,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    // Row DnD
    if (onRowOrderChange) {
      const isRowDrag =
        table.getRowModel().rowsById[activeId] &&
        table.getRowModel().rowsById[overId];
      if (isRowDrag) {
        onRowOrderChange(activeId, overId);
        return;
      }
    }

    // Column DnD
    if (onColumnOrderChange) {
      const isColumnDrag = table.getColumn(activeId) && table.getColumn(overId);
      if (isColumnDrag) {
        const currentColumnOrder =
          table.getState().columnOrder ??
          table.getAllLeafColumns().map((c) => c.id);
        const oldIndex = currentColumnOrder.indexOf(activeId);
        const newIndex = currentColumnOrder.indexOf(overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(currentColumnOrder, oldIndex, newIndex);
          onColumnOrderChange(newOrder);
        }
        return;
      }
    }
    console.warn("Unknown DnD operation or target:", active, over);
  };

  const rowIds = useMemo(
    () => table.getRowModel().rows.map((row) => row.id),
    [table.getRowModel],
  );
  const columnOrder = table.getState().columnOrder;
  const columnIds = useMemo(
    () => columnOrder ?? table.getAllLeafColumns().map((c) => c.id),
    [columnOrder, table.getAllLeafColumns],
  );

  /**
   * CSVダウンロード処理を実行する非同期関数
   */
  const handleCsvDownload = useCallback(async () => {
    if (!onCsvDownloadRequest || isDownloadingCsv) {
      return; // リクエストハンドラがないか、ダウンロード中は処理しない
    }

    setIsDownloadingCsv(true);
    try {
      const { data: csvDataArray, filenamePrefix = "data" } =
        await onCsvDownloadRequest();

      if (!csvDataArray || csvDataArray.length === 0) {
        console.warn("CSVデータが空または提供されませんでした。");
        // TODO: ユーザーにフィードバックする (例: トースト通知)
        return;
      }

      // papaparse で CSV 文字列に変換 (ヘッダーは自動生成される)
      const csvString = unparse(csvDataArray);

      // BOM を追加して Excel での文字化けを防ぐ
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      const csvBlob = new Blob([bom, csvString], {
        type: "text/csv;charset=utf-8;",
      });

      // ダウンロードリンクを作成してクリック
      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = csvUrl;
      const suffix = format(new Date(), "yyyyMMdd_HHmmss");
      link.download = `${filenamePrefix}_${suffix}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(csvUrl);
    } catch (error) {
      console.error("CSVダウンロード中にエラーが発生しました:", error);
      // TODO: ユーザーにエラーをフィードバックする (例: トースト通知)
    } finally {
      setIsDownloadingCsv(false); // 処理が完了したら状態をリセット
    }
  }, [onCsvDownloadRequest, isDownloadingCsv]);

  return {
    table,
    sensors,
    handleDragEnd,
    rowIds,
    columnIds,
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    CSS,
    flexRender,
    DndContext,
    closestCenter,
    isDownloadingCsv, // ダウンロード中状態を返す
    handleCsvDownload, // ダウンロードハンドラを返す
  };
};

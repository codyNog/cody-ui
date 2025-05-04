import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // CSS をインポート
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table"; // flexRender をインポート
import type { CSSProperties } from "react";
import type { DataWithId } from "./types"; // DataWithId をインポート

type DraggableRowProps<TData extends DataWithId> = {
  row: Row<TData>;
  columnIds: string[]; // columnIds を props として受け取る
};

export const DraggableRow = <TData extends DataWithId>({
  row,
  columnIds, // props から columnIds を受け取る
}: DraggableRowProps<TData>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <tr key={row.id} ref={setNodeRef} style={style} {...attributes}>
      {/* ハンドル用のセルに listeners を適用 */}
      <td style={{ width: "40px", cursor: "grab" }} {...listeners}>
        ☰
      </td>
      {/* columnIds を使ってセルをレンダリング */}
      {columnIds.map((columnId) => {
        const cell = row
          .getVisibleCells()
          .find((c) => c.column.id === columnId);
        if (!cell) return null;
        return (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
};

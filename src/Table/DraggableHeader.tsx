import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { CSS } from "@dnd-kit/utilities"; // CSS を type import
import { flexRender, type Header } from "@tanstack/react-table";
import type { DataWithId } from "./types";

type DraggableHeaderProps<TData extends DataWithId> = {
  header: Header<TData, unknown>;
  CSS: typeof CSS; // CSS の型を typeof CSS に変更
};

export const DraggableHeader = <TData extends DataWithId>({
  header,
  CSS,
}: DraggableHeaderProps<TData>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: header.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    whiteSpace: "nowrap",
  };

  return (
    <th
      key={header.id}
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      {...attributes}
      {...listeners}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
};

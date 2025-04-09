"use client";
import { forwardRef, type ReactNode } from "react";
import styles from "./index.module.css";

type ColumnProps = {
  /**
   * 横方向のセル数
   * @default 1
   */
  span?: number;
  /**
   * 開始位置（特定の位置に配置したい場合）
   */
  start?: number;
  /**
   * 子要素
   */
  children: ReactNode;
  /**
   * その他のスタイルプロパティ
   */
  className?: string;
};

export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ span = 1, start, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`column ${className || ""}`}
        style={{
          gridColumn: start ? `${start} / span ${span}` : `span ${span}`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Column.displayName = "Grid.Column";

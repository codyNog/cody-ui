"use client";
import { forwardRef, type ReactNode } from "react";
import styles from "./index.module.css";

type RowProps = {
  /**
   * 子要素
   */
  children: ReactNode;
  /**
   * その他のスタイルプロパティ
   */
  className?: string;
};

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.row} ${styles.responsive} ${className || ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Row.displayName = "Grid.Row";

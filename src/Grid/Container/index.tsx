"use client";
import { type ReactNode, forwardRef } from "react";
import styles from "./index.module.css";

type ContainerProps = {
  /**
   * コンテナの最大幅
   * @default 'auto'
   */
  maxWidth?: string;
  /**
   * 子要素
   */
  children: ReactNode;
  /**
   * その他のスタイルプロパティ
   */
  className?: string;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = "auto", children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${className || ""}`}
        style={{ maxWidth: maxWidth === "auto" ? "none" : maxWidth }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Grid.Container";

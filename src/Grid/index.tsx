"use client";
import {
  type CSSProperties,
  Children,
  type ReactNode,
  forwardRef,
  isValidElement,
} from "react";
import styles from "./index.module.css";

// グリッドのバリアント
export type GridVariant = "default" | "bento";

// 共通のGridコンポーネントのProps
type GridProps = {
  /**
   * グリッドに表示する子要素
   */
  children: ReactNode;

  /**
   * グリッドのバリアント
   * @default "default"
   */
  variant?: GridVariant;

  /**
   * コンテナクエリを使用するかどうか（bentoバリアントのみ有効）
   * @default true
   */
  containerQuery?: boolean;

  /**
   * グリッドのカラム数
   * @default 12
   */
  columns?: number;

  /**
   * グリッド間のギャップ
   */
  gap?: string | number;

  /**
   * 追加のクラス名
   */
  className?: string;
};

// GridItemの共通Props
type GridItemProps = {
  /**
   * グリッドアイテムに表示する内容
   */
  children: ReactNode;

  /**
   * アイテムのバリアント（親のGridと同じにすることを推奨）
   * @default "default"
   */
  variant?: GridVariant;

  /**
   * アイテムが占める列数（12列グリッドシステム）
   * @default 3
   */
  colSpan?: 1 | 2 | 3 | 4 | 6 | 8 | 12;

  /**
   * アイテムが占める行数
   * @default 1
   */
  rowSpan?: 1 | 2 | 3;

  /**
   * 追加のクラス名
   */
  className?: string;
};

// GridRowのProps
type GridRowProps = GridItemProps & {
  /**
   * 要素間のギャップ
   * @default var(--space-3)
   */
  spacing?: string | number;

  /**
   * 縦方向の配置
   * @default center
   */
  align?: "start" | "center" | "end" | "stretch";

  /**
   * 横方向の配置
   * @default start
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /**
   * 折り返すかどうか
   * @default false
   */
  wrap?: boolean;
};

// GridItemコンポーネント
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      children,
      variant = "default",
      colSpan = 3,
      rowSpan = 1,
      className,
      ...props
    },
    ref,
  ) => {
    const isBento = variant === "bento";
    const itemClassName = isBento
      ? `${styles.item} ${styles.bentoItem} ${className || ""}`
      : `${styles.item} ${className || ""}`;

    return (
      <div
        ref={ref}
        className={itemClassName}
        data-col-span={colSpan}
        data-row-span={rowSpan}
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GridItem.displayName = "GridItem";

// GridRowコンポーネント - 横並びのアイテム用
export const GridRow = forwardRef<HTMLDivElement, GridRowProps>(
  (
    {
      children,
      variant = "default",
      colSpan = 12,
      rowSpan = 1,
      spacing = "var(--space-3)",
      align = "center",
      justify = "start",
      wrap = false,
      className,
      ...props
    },
    ref,
  ) => {
    // alignとjustifyのマッピング
    const alignMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
    };

    const justifyMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
    };

    const isBento = variant === "bento";
    const rowClassName = isBento
      ? `${styles.item} ${styles.row} ${styles.bentoRow} ${className || ""}`
      : `${styles.item} ${styles.row} ${className || ""}`;

    return (
      <div
        ref={ref}
        className={rowClassName}
        data-col-span={colSpan}
        data-row-span={rowSpan}
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
          gap: spacing,
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
          flexWrap: wrap ? "wrap" : "nowrap",
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GridRow.displayName = "GridRow";

// 後方互換性のためのBentoGridItemコンポーネント
export const BentoGridItem = forwardRef<
  HTMLDivElement,
  Omit<GridItemProps, "variant">
>((props, ref) => {
  return <GridItem ref={ref} variant="bento" {...props} />;
});

BentoGridItem.displayName = "BentoGridItem";

// 基本のGridコンポーネント
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      variant = "default",
      containerQuery = true,
      columns = 12,
      gap,
      className,
      ...props
    },
    ref,
  ) => {
    const style: CSSProperties = {};

    if (columns) {
      // 最小幅を設定して、内容が潰れないようにする
      style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    }

    if (gap !== undefined) {
      style.gap = gap;
    }

    // バリアントに応じたクラス名を設定
    const isBento = variant === "bento";
    const gridClassName = isBento
      ? containerQuery
        ? `${styles.grid} ${styles.bentoGrid} ${className || ""}`
        : `${styles.grid} ${className || ""}`
      : `${styles.grid} ${className || ""}`;

    // Bentoバリアントの場合は子要素を検証
    if (isBento) {
      const validChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
          // GridItemまたはGridRowの場合は、variantプロパティを追加
          if (
            child.type === GridItem ||
            child.type === GridRow ||
            // 後方互換性のために古いコンポーネントもサポート
            child.type === BentoGridItem
          ) {
            // propsが存在することを確認
            const childProps = child.props || {};
            return {
              ...child,
              props: {
                ...childProps,
                variant: "bento",
              },
            };
          }
          console.warn(
            "BentoGrid variant only accepts GridItem or GridRow components as children.",
          );
          return null;
        }
        return child;
      });

      return (
        <div ref={ref} className={gridClassName} style={style} {...props}>
          {validChildren}
        </div>
      );
    }

    return (
      <div ref={ref} className={gridClassName} style={style} {...props}>
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";

// 後方互換性のためのBentoGridコンポーネント
export const BentoGrid = forwardRef<HTMLDivElement, Omit<GridProps, "variant">>(
  (props, ref) => {
    return <Grid ref={ref} variant="bento" {...props} />;
  },
);

BentoGrid.displayName = "BentoGrid";

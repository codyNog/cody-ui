"use client";
import {
  type CSSProperties,
  Children,
  type ReactNode,
  forwardRef,
  isValidElement,
} from "react";
import styles from "./index.module.css";

/**
 * Defines the possible variants for the Grid.
 * - `default`: A standard grid layout.
 * - `bento`: A bento-style grid layout, often used for dashboards or complex UIs.
 */
type GridVariant = "default" | "bento";

/**
 * Props for the Grid component.
 */
export type Props = {
  /**
   * The content to be displayed within the grid.
   */
  children: ReactNode;

  /**
   * The variant of the grid.
   * @default "default"
   */
  variant?: GridVariant;

  /**
   * Whether to use container queries (only effective for the "bento" variant).
   * @default true
   */
  containerQuery?: boolean;

  /**
   * The number of columns in the grid.
   * @default 12
   */
  columns?: number;

  /**
   * The gap between grid items.
   */
  gap?: string | number;

  /**
   * Additional CSS class name(s) to apply to the grid.
   */
  className?: string;
};

/**
 * Props for the GridItem component.
 */
export type ItemProps = {
  /**
   * The content to be displayed within the grid item.
   */
  children: ReactNode;

  /**
   * The variant of the item (recommended to match the parent Grid's variant).
   * @default "default"
   */
  variant?: GridVariant;

  /**
   * The number of columns the item should span (in a 12-column grid system).
   * @default 3
   */
  colSpan?: 1 | 2 | 3 | 4 | 6 | 8 | 12;

  /**
   * The number of rows the item should span.
   * @default 1
   */
  rowSpan?: 1 | 2 | 3;

  /**
   * Additional CSS class name(s) to apply to the grid item.
   */
  className?: string;
};

/**
 * Props for the GridRow component.
 */
export type RowProps = ItemProps & {
  /**
   * The spacing between elements within the row.
   * @default var(--space-3)
   */
  spacing?: string | number;

  /**
   * The vertical alignment of items within the row.
   * @default center
   */
  align?: "start" | "center" | "end" | "stretch";

  /**
   * The horizontal alignment of items within the row.
   * @default start
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /**
   * Whether items in the row should wrap to the next line if they exceed the available width.
   * @default false
   */
  wrap?: boolean;
};

/**
 * GridItem component represents an individual item within a Grid.
 */
export const GridItem = forwardRef<HTMLDivElement, ItemProps>(
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

/**
 * GridRow component is used for arranging items horizontally within a Grid.
 */
export const GridRow = forwardRef<HTMLDivElement, RowProps>(
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

/**
 * BentoGridItem component is a specialized GridItem for use within a BentoGrid.
 * This component is provided for backward compatibility.
 * It is recommended to use GridItem with the variant="bento" prop instead.
 */
export const BentoGridItem = forwardRef<
  HTMLDivElement,
  Omit<ItemProps, "variant">
>((props, ref) => {
  return <GridItem ref={ref} variant="bento" {...props} />;
});

BentoGridItem.displayName = "BentoGridItem";

/**
 * Grid component provides a flexible layout system based on CSS Grid.
 * It supports different variants like "default" and "bento".
 */
export const Grid = forwardRef<HTMLDivElement, Props>(
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
      style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    }

    if (gap !== undefined) {
      style.gap = gap;
    }

    const isBento = variant === "bento";
    const gridClassName = isBento
      ? containerQuery
        ? `${styles.grid} ${styles.bentoGrid} ${className || ""}`
        : `${styles.grid} ${className || ""}`
      : `${styles.grid} ${className || ""}`;

    if (isBento) {
      const validChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
          if (
            child.type === GridItem ||
            child.type === GridRow ||
            child.type === BentoGridItem
          ) {
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

/**
 * BentoGrid component is a specialized Grid for creating bento-style layouts.
 * This component is provided for backward compatibility.
 * It is recommended to use Grid with the variant="bento" prop instead.
 */
export const BentoGrid = forwardRef<HTMLDivElement, Omit<Props, "variant">>(
  (props, ref) => {
    return <Grid ref={ref} variant="bento" {...props} />;
  },
);

BentoGrid.displayName = "BentoGrid";

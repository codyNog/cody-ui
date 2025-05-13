"use client";
import { forwardRef } from "react";
import styles from "./index.module.css";

/**
 * Props for the Badge component.
 * It can be a small dot or a large badge with a count.
 */
type BadgeProps =
  | {
      /**
       * The variant of the badge.
       * 'small' renders a small dot.
       * @default 'small'
       */
      variant?: "small";
      /** Not applicable for 'small' variant. */
      count?: never;
    }
  | {
      /**
       * The variant of the badge.
       * 'large' renders a badge that can display a count.
       */
      variant: "large";
      /**
       * The number to display in the badge.
       * If the count exceeds 99, it will be displayed as "99+".
       * If undefined, the large badge will be displayed without a number.
       */
      count?: number;
    };

/**
 * The Badge component is used to indicate notifications or status.
 * - `small`: A small dot-like badge.
 * - `large`: A badge that displays a numerical count.
 *
 * To apply custom styles, wrap this component with another element and apply styles to the wrapper.
 *
 * @example
 * ```tsx
 * // Small badge
 * <Badge />
 *
 * // Large badge with count
 * <Badge variant="large" count={5} />
 *
 * // Large badge with count exceeding 99
 * <Badge variant="large" count={100} />
 *
 * // Large badge without a count (renders as a larger dot)
 * <Badge variant="large" />
 * ```
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "small", ...props }, ref) => {
    const getBadgeContent = () => {
      if (variant === "large") {
        const currentCount = (props as { count?: number }).count;
        if (typeof currentCount === "number") {
          if (currentCount > 99) {
            return "99+";
          }
          return currentCount;
        }
      }
      return null;
    };

    const getVariantClassName = () => {
      if (variant === "small") {
        return styles.small;
      }
      if (variant === "large") {
        return typeof (props as { count?: number }).count === "number"
          ? styles.largeWithCount
          : styles.largeNoCount;
      }
      return "";
    };

    const badgeClassName = [styles.badge, getVariantClassName()]
      .filter(Boolean)
      .join(" ");

    const shouldRenderSpan =
      variant === "large" &&
      typeof (props as { count?: number }).count === "number";

    return (
      <div ref={ref} className={badgeClassName}>
        {shouldRenderSpan && (
          <span className={styles.count}>{getBadgeContent()}</span>
        )}
      </div>
    );
  },
);

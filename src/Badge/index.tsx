"use client";
import { forwardRef } from "react";
import styles from "./index.module.css";

type BadgeProps =
  | {
      variant?: "small";
      count?: never;
    }
  | {
      variant: "large";
      /**
       * バッジに表示する数値。
       * 99を超える場合は "99+" と表示されます。
       */
      count?: number;
    };

/**
 * Badgeコンポーネントは、通知やステータスを示すために使用されます。
 * - `small`: 小さなドット状のバッジです。
 * - `large`: 数値を表示するバッジです。
 *
 * スタイルを適用したい場合は、このコンポーネントを別の要素でラップして適用してください。
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

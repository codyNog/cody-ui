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
      return null; // countがない場合やsmallの場合は何も表示しない
    };

    const getVariantClassName = () => {
      if (variant === "small") {
        return styles.small;
      }
      if (variant === "large") {
        // propsがcountプロパティを持つか、かつその型がnumberであるかで判定
        return typeof (props as { count?: number }).count === "number"
          ? styles.largeWithCount // countがある場合はpill形状
          : styles.largeNoCount; // countがない場合は大きな円
      }
      return ""; // Should not happen with current BadgeProps
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

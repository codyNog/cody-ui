import { forwardRef } from "react";
import { Separator, type SeparatorProps } from "react-aria-components";
import styles from "./index.module.css";

type Props = {
  /**
   * Divider の方向
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * インセットスタイルを適用するかどうか
   * @default false
   */
  inset?: boolean;
} & Omit<SeparatorProps, "orientation">; // SeparatorProps から orientation を除外して、独自の型定義を使う

export const Divider = forwardRef<HTMLHRElement, Props>(
  ({ orientation = "horizontal", inset = false, className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        orientation={orientation}
        className={`${styles.divider} ${styles[orientation]} ${
          inset ? styles.inset : ""
        } ${className || ""}`.trim()}
        {...props}
      />
    );
  },
);

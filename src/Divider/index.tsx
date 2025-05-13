import { forwardRef } from "react";
import { Separator, type SeparatorProps } from "react-aria-components";
import styles from "./index.module.css";

/**
 * Props for the Divider component.
 */
type Props = {
  /**
   * The orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Whether to apply an inset style to the divider.
   * Inset dividers do not span the full width or height of their container.
   * @default false
   */
  inset?: boolean;
} & Omit<SeparatorProps, "orientation">; // SeparatorProps から orientation を除外して、独自の型定義を使う

/**
 * A Divider is a thin line that groups content in lists and layouts.
 * It supports horizontal and vertical orientations, as well as an inset style.
 *
 * @example
 * ```tsx
 * // Horizontal Divider
 * <Divider />
 *
 * // Vertical Divider
 * <div style={{ display: 'flex', height: '50px' }}>
 *   <span>Left</span>
 *   <Divider orientation="vertical" />
 *   <span>Right</span>
 * </div>
 *
 * // Inset Horizontal Divider
 * <Divider inset />
 * ```
 */
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

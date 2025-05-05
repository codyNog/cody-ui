import { Separator, type SeparatorProps } from "react-aria-components";
import styles from "./index.module.css";
import { forwardRef } from "react";
import clsx from "clsx"; // スタイルを結合するために clsx を使うのがおすすめ

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
        className={clsx(
          styles.divider,
          styles[orientation], // horizontal か vertical のスタイルを適用
          { [styles.inset]: inset }, // inset が true なら inset スタイルを適用
          className,
        )}
        {...props}
      />
    );
  },
);

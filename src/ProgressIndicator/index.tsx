"use client";
import { type ForwardedRef, forwardRef } from "react"; // ReactElement と Ref を削除し、ForwardedRef を追加
import { ProgressBar } from "react-aria-components";
import styles from "./index.module.css";

/**
 * プログレスインジケーターの基本的な Props です。
 */
type ProgressIndicatorBaseProps = {
  /**
   * プログレスインジケーターのサイズを指定します。
   * 省略した場合、デフォルトのサイズが適用されます。
   */
  size?: "small" | "medium" | "large";
  /**
   * スクリーンリーダーが読み上げるためのアクセシビリティラベルです。
   */
  ariaLabel?: string;
};

/**
 * 確定的な線形プログレスインジケーターの Props です。
 */
type DeterminateLinearProgressIndicatorProps = ProgressIndicatorBaseProps & {
  variant: "linear";
  indeterminate?: false;
  value: number;
  ariaValueText?: string;
};

/**
 * 不確定な線形プログレスインジケーターの Props です。
 */
type IndeterminateLinearProgressIndicatorProps = ProgressIndicatorBaseProps & {
  variant: "linear";
  indeterminate: true;
  value?: never;
  ariaValueText?: never;
};

/**
 * 確定的な円形プログレスインジケーターの Props です。
 */
type DeterminateCircularProgressIndicatorProps = ProgressIndicatorBaseProps & {
  variant: "circular";
  indeterminate?: false;
  value: number;
  ariaValueText?: string;
};

/**
 * 不確定な円形プログレスインジケーターの Props です。
 */
type IndeterminateCircularProgressIndicatorProps =
  ProgressIndicatorBaseProps & {
    variant: "circular";
    indeterminate: true;
    value?: never;
    ariaValueText?: never;
    fourColor?: boolean;
  };

/**
 * プログレスインジケーターコンポーネントの Props です。
 */
export type ProgressIndicatorProps =
  | DeterminateLinearProgressIndicatorProps
  | IndeterminateLinearProgressIndicatorProps
  | DeterminateCircularProgressIndicatorProps
  | IndeterminateCircularProgressIndicatorProps;

/**
 * ProgressIndicator コンポーネントは、タスクの進捗状況を視覚的に示します。
 * 線形または円形のスタイル、確定的または不確定的な状態をサポートします。
 */
export const ProgressIndicator = forwardRef(
  (props: ProgressIndicatorProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { variant, ariaLabel } = props;

    const defaultAriaLabel = "Progress";
    const finalAriaLabel =
      ariaLabel && ariaLabel.trim() !== "" ? ariaLabel : defaultAriaLabel;

    if (variant === "linear") {
      const { indeterminate, value, ariaValueText } = props;
      return (
        <ProgressBar
          ref={ref}
          aria-label={finalAriaLabel}
          aria-valuetext={indeterminate ? undefined : ariaValueText}
          isIndeterminate={indeterminate}
          value={indeterminate ? undefined : value} // ProgressBar側で indeterminate なら value を無視してくれるはず
          className={styles.root}
        >
          {({
            percentage,
            isIndeterminate: indeterminateState /*, valueText*/,
          }) => (
            <div
              className={styles.fill}
              style={{
                width: indeterminateState ? undefined : `${percentage}%`,
              }}
              data-indeterminate={indeterminateState}
            />
          )}
        </ProgressBar>
      );
    }

    if (variant === "circular") {
      const { indeterminate, value, ariaValueText } = props;

      const radius = 20; // SVGビューボックス内の半径 (50x50 viewBox で stroke-width 4 の場合)
      const circumference = 2 * Math.PI * radius;

      return (
        <ProgressBar
          ref={ref}
          aria-label={finalAriaLabel}
          aria-valuetext={indeterminate ? undefined : ariaValueText}
          isIndeterminate={indeterminate}
          value={indeterminate ? undefined : value}
          className={styles.circularRoot}
        >
          {({ percentage, isIndeterminate: indeterminateState }) => {
            const strokeDashoffset =
              indeterminateState || typeof percentage === "undefined" // percentage が undefined の場合も考慮
                ? undefined // CSSアニメーションで制御
                : circumference - (percentage / 100) * circumference;
            return (
              <svg viewBox="0 0 48 48" className={styles.circularSvg}>
                <title>{finalAriaLabel}</title>
                <circle
                  className={styles.circularTrack}
                  cx="24"
                  cy="24"
                  r={radius}
                />
                <circle
                  className={styles.circularIndicator}
                  cx="24"
                  cy="24"
                  r={radius}
                  pathLength={indeterminateState ? 200 : circumference}
                  strokeDasharray={
                    indeterminateState ? undefined : circumference
                  }
                  strokeDashoffset={strokeDashoffset}
                  data-indeterminate={indeterminateState}
                  data-four-color={
                    indeterminateState && "fourColor" in props
                      ? props.fourColor
                      : undefined
                  }
                />
              </svg>
            );
          }}
        </ProgressBar>
      );
    }
  },
);

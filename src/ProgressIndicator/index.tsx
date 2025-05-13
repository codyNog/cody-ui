"use client";
import { type ForwardedRef, forwardRef } from "react";
import { ProgressBar } from "react-aria-components";
import styles from "./index.module.css";

/**
 * Base props for the ProgressIndicator component.
 */
type ProgressIndicatorBaseProps = {
  /**
   * Specifies the size of the progress indicator.
   * If omitted, the default size will be applied.
   */
  size?: "small" | "medium" | "large";
  /**
   * Accessibility label for screen readers.
   */
  ariaLabel?: string;
};

/**
 * Props for a determinate linear progress indicator.
 */
type DeterminateLinearProgressIndicatorProps = ProgressIndicatorBaseProps & {
  /** The visual style of the progress indicator. */
  variant: "linear";
  /** Whether the progress is indeterminate. */
  indeterminate?: false;
  /** The current value of the progress (0-100). */
  value: number;
  /** Textual representation of the current value for accessibility. */
  ariaValueText?: string;
};

/**
 * Props for an indeterminate linear progress indicator.
 */
type IndeterminateLinearProgressIndicatorProps = ProgressIndicatorBaseProps & {
  /** The visual style of the progress indicator. */
  variant: "linear";
  /** Whether the progress is indeterminate. */
  indeterminate: true;
  /** The current value (not applicable for indeterminate). */
  value?: never;
  /** Textual representation of the current value (not applicable for indeterminate). */
  ariaValueText?: never;
};

/**
 * Props for a determinate circular progress indicator.
 */
type DeterminateCircularProgressIndicatorProps = ProgressIndicatorBaseProps & {
  /** The visual style of the progress indicator. */
  variant: "circular";
  /** Whether the progress is indeterminate. */
  indeterminate?: false;
  /** The current value of the progress (0-100). */
  value: number;
  /** Textual representation of the current value for accessibility. */
  ariaValueText?: string;
};

/**
 * Props for an indeterminate circular progress indicator.
 */
type IndeterminateCircularProgressIndicatorProps =
  ProgressIndicatorBaseProps & {
    /** The visual style of the progress indicator. */
    variant: "circular";
    /** Whether the progress is indeterminate. */
    indeterminate: true;
    /** The current value (not applicable for indeterminate). */
    value?: never;
    /** Textual representation of the current value (not applicable for indeterminate). */
    ariaValueText?: never;
    /** Whether to use four colors for the indeterminate circular indicator. */
    fourColor?: boolean;
  };

/**
 * Props for the ProgressIndicator component.
 * This is a union of different progress indicator types.
 */
type ProgressIndicatorProps =
  | DeterminateLinearProgressIndicatorProps
  | IndeterminateLinearProgressIndicatorProps
  | DeterminateCircularProgressIndicatorProps
  | IndeterminateCircularProgressIndicatorProps;

/**
 * The ProgressIndicator component visually displays the progress of a task.
 * It supports linear or circular styles, and determinate or indeterminate states.
 *
 * @example
 * ```tsx
 * // Determinate Linear
 * <ProgressIndicator variant="linear" value={50} ariaLabel="Loading data" />
 *
 * // Indeterminate Linear
 * <ProgressIndicator variant="linear" indeterminate ariaLabel="Processing" />
 *
 * // Determinate Circular
 * <ProgressIndicator variant="circular" value={75} ariaLabel="Uploading file" />
 *
 * // Indeterminate Circular
 * <ProgressIndicator variant="circular" indeterminate ariaLabel="Please wait" />
 *
 * // Indeterminate Circular with four colors
 * <ProgressIndicator variant="circular" indeterminate fourColor ariaLabel="Loading..." />
 * ```
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
          value={indeterminate ? undefined : value}
          className={styles.root}
        >
          {({ percentage, isIndeterminate: indeterminateState }) => (
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

      const radius = 20;
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
              indeterminateState || typeof percentage === "undefined"
                ? undefined
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

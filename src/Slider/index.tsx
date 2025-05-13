"use client";
import { forwardRef } from "react";
import {
  Label,
  Slider as RacSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import styles from "./index.module.css";

/** Defines the interaction mode of the slider. */
type Mode = "continuous" | "centered";

/** Defines the visual variant of the slider. */
type Variant = "number" | "range";

/**
 * Props for the Slider component.
 */
type Props = {
  /** Optional label for the slider. */
  label?: string;
  /** The current value of the slider. Can be a single number or an array for range sliders. */
  value: number | number[];
  /** Callback function invoked when the slider value changes. */
  onChange: (value: number | number[]) => void;
  /** The minimum value of the slider. @default 0 */
  minValue?: number;
  /** The maximum value of the slider. @default 100 */
  maxValue?: number;
  /** The step increment of the slider. */
  step?: number;
  /** The interaction mode of the slider. @default "continuous" */
  mode?: Mode;
  /** The visual variant of the slider. */
  variant?: Variant;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
  /** The orientation of the slider. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
};

/**
 * Slider component allows users to select a value or a range of values along a track.
 * It is built on top of `react-aria-components` and styled according to Material Design 3.
 */
export const Slider = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      value,
      onChange,
      minValue = 0,
      maxValue = 100,
      step,
      isDisabled,
      mode = "continuous",
      orientation = "horizontal",
      ...props
    },
    ref,
  ) => {
    const showTickMarks = step !== undefined && step > 0;
    let tickMarks: number[] = [];
    if (showTickMarks) {
      const numSteps = Math.floor((maxValue - minValue) / step);
      for (let i = 0; i <= numSteps; i++) {
        const tickValue = minValue + i * step;
        if (tickValue <= maxValue) {
          tickMarks.push(tickValue);
        } else if (
          i === numSteps &&
          tickMarks[tickMarks.length - 1] < maxValue
        ) {
          tickMarks.push(maxValue);
        }
      }
      if (
        tickMarks.length === 0 ||
        (tickMarks.length > 0 && tickMarks[0] > minValue)
      ) {
        tickMarks.unshift(minValue);
      }
      if (
        tickMarks.length === 0 ||
        (tickMarks.length > 0 &&
          tickMarks[tickMarks.length - 1] < maxValue &&
          step > maxValue - minValue)
      ) {
        if (!tickMarks.includes(maxValue)) tickMarks.push(maxValue);
      }
      tickMarks = [...new Set(tickMarks)].sort((a, b) => a - b);
    }

    return (
      <RacSlider
        ref={ref}
        value={value}
        onChange={onChange}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        isDisabled={isDisabled}
        orientation={orientation}
        className={styles.slider}
        data-disabled={isDisabled ? "" : undefined}
        data-discrete={showTickMarks ? "" : undefined}
        {...props}
      >
        {label && <Label className={styles.label}>{label}</Label>}
        <div className={styles.trackContainer}>
          <SliderTrack className={styles.track}>
            {({ state }) => (
              <>
                {showTickMarks && orientation === "horizontal" && (
                  <div className={styles.tickMarksContainer}>
                    {tickMarks.map((tickVal, index) => {
                      const isActive = Array.isArray(value)
                        ? tickVal >= value[0] &&
                          tickVal <= value[value.length - 1]
                        : tickVal <= value;
                      const key = `tick-${index}`;
                      return (
                        <div
                          key={key}
                          className={styles.tickMark}
                          data-active={isActive ? "" : undefined}
                        />
                      );
                    })}
                  </div>
                )}
                {state.values.length === 1 && (
                  <div
                    className={styles.trackFill}
                    style={{
                      width: `${state.getThumbPercent(0) * 100}%`,
                    }}
                  />
                )}
                {state.values.length > 1 && (
                  <div
                    className={styles.trackFill}
                    style={{
                      left: `${state.getThumbPercent(0) * 100}%`,
                      width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
                    }}
                  />
                )}
                {state.values.map((_, i) => {
                  const key = `thumb-${i}`;
                  return (
                    <SliderThumb key={key} index={i} className={styles.thumb}>
                      <SliderOutput className={styles.output}>
                        {({ state: thumbState }) =>
                          thumbState.getThumbValueLabel(i)
                        }
                      </SliderOutput>
                    </SliderThumb>
                  );
                })}
              </>
            )}
          </SliderTrack>
        </div>
      </RacSlider>
    );
  },
);

Slider.displayName = "Slider";

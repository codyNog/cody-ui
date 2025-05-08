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

type Mode = "continuous" | "centered";

type Variant = "number" | "range";

type Props = {
  label?: string; // ラベルはあったほうがいいよね！
  value: number | number[]; // range の場合は配列になるかも
  onChange: (value: number | number[]) => void;
  minValue?: number; // react-aria-components に合わせて変更
  maxValue?: number; // react-aria-components に合わせて変更
  step?: number;
  mode?: Mode; // これは react-aria-components に直接はないかも？一旦残す
  variant?: Variant; // これも react-aria-components に直接はないかも？一旦残す
  isDisabled?: boolean;
  orientation?: "horizontal" | "vertical";
};

export const Slider = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      value,
      onChange,
      minValue = 0, // Default minValue if not provided
      maxValue = 100, // Default maxValue if not provided
      step,
      // mode, // TODO: mode と variant の処理は後で考える
      // variant,
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
        // Ensure tick does not exceed maxValue if step doesn't align perfectly
        if (tickValue <= maxValue) {
          tickMarks.push(tickValue);
        } else if (
          i === numSteps &&
          tickMarks[tickMarks.length - 1] < maxValue
        ) {
          // Add maxValue as the last tick if it wasn't perfectly divisible
          tickMarks.push(maxValue);
        }
      }
      // Ensure the first and last tick marks correspond to minValue and maxValue if step is large
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
        // if only one step and it's larger than the range, ensure max value is a tick
        if (!tickMarks.includes(maxValue)) tickMarks.push(maxValue);
      }
      // Remove duplicates that might have been added
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
        {/* Label is styled as display:none in CSS for M3, but kept for prop compatibility */}
        {label && <Label className={styles.label}>{label}</Label>}
        {/* SliderOutput is used for the value tooltip */}
        <SliderOutput className={styles.output}>
          {({ state }) =>
            state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
          }
        </SliderOutput>
        {/* trackContainer for positioning track and thumbs */}
        <div className={styles.trackContainer}>
          <SliderTrack className={styles.track}>
            {({ state }) => (
              <>
                {/* Tick Marks */}
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
                          // Style for positioning can be added here if needed,
                          // but CSS handles space-between for now.
                          // For precise positioning:
                          // style={{ left: `${((tickVal - minValue) / (maxValue - minValue)) * 100}%` }}
                        />
                      );
                    })}
                  </div>
                )}
                {/* Track Fill */}
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
                {/* Thumbs */}
                {state.values.map((_, i) => {
                  const key = `thumb-${i}`;
                  return (
                    <SliderThumb
                      key={key} // Using index as key is acceptable here as thumb count/order is stable.
                      index={i}
                      className={styles.thumb}
                      // data-focus-visible, data-dragging are automatically applied by RAC
                    />
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

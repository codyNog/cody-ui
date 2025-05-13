"use client";
import type { PressEvent } from "@react-types/shared";
import {
  type ComponentProps,
  type MouseEvent,
  type RefObject,
  useState,
} from "react";
import styles from "./index.module.css";

/**
 * Represents the state of a single ripple effect.
 */
type RippleType = {
  /** A unique key for the ripple, typically a timestamp. */
  key: number;
  /** The x-coordinate of the ripple's origin. */
  x: number;
  /** The y-coordinate of the ripple's origin. */
  y: number;
  /** The size (diameter) of the ripple. */
  size: number;
};

/**
 * Props for the internal RippleComponent.
 */
type Props = {
  /** The current ripple state, or null if no ripple is active. */
  ripple: RippleType | null;
  /** Callback function to clear the active ripple. */
  clearRipple: () => void;
  /** Optional ref to a boolean indicating if the user is currently inputting (e.g., via keyboard). */
  isInputtingRef?: RefObject<boolean>;
};

/**
 * Internal component responsible for rendering a single ripple effect.
 */
const RippleComponent = ({ ripple, clearRipple, isInputtingRef }: Props) => {
  return (
    <span className={styles.rippleContainer}>
      {ripple && !isInputtingRef?.current && (
        <span
          key={ripple.key}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          onAnimationEnd={clearRipple}
        />
      )}
    </span>
  );
};

/**
 * Custom hook to manage and render ripple effects on a component.
 *
 * @param isInputtingRef - Optional ref to a boolean. If true, ripples are suppressed (e.g., during keyboard input).
 * @returns An object containing:
 *  - `handleClick`: A function to trigger a ripple effect based on a mouse or press event.
 *  - `component`: A React component that renders the ripple visualization.
 *
 * @example
 * ```tsx
 * const MyButton = (props) => {
 *   const buttonRef = useRef(null);
 *   const { handleClick: handleRippleClick, component: RippleVisuals } = useRipple();
 *
 *   return (
 *     <button
 *       ref={buttonRef}
 *       onMouseDown={(e) => handleRippleClick(e, buttonRef)}
 *       {...props}
 *     >
 *       {props.children}
 *       <RippleVisuals />
 *     </button>
 *   );
 * };
 * ```
 */
export const useRipple = (isInputtingRef?: RefObject<boolean>) => {
  const [ripple, setRipple] = useState<RippleType | null>(null);

  const clearRipple = () => {
    setRipple(null);
  };

  type RippleComponentProps = Omit<
    ComponentProps<typeof RippleComponent>,
    "ripple" | "clearRipple" | "isInputtingRef"
  >;

  const component = (props: RippleComponentProps) => {
    return (
      <RippleComponent
        ripple={ripple}
        clearRipple={clearRipple}
        isInputtingRef={isInputtingRef}
        {...props}
      />
    );
  };

  const handleClick = (
    event: MouseEvent<globalThis.Element> | PressEvent,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ref: RefObject<any>,
  ) => {
    if (isInputtingRef?.current) {
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      let x: number;
      let y: number;

      if ("clientX" in event && "clientY" in event) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else if ("x" in event && "y" in event) {
        const pressX = event.x as number;
        const pressY = event.y as number;
        x = pressX;
        y = pressY;
      } else {
        x = rect.width / 2;
        y = rect.height / 2;
      }

      const newRipple: RippleType = {
        key: Date.now(),
        x,
        y,
        size,
      };
      setRipple(newRipple);
      // Add a timeout to clear the ripple after the animation duration.
      // This ensures the ripple is cleared even if onAnimationEnd doesn't fire as expected
      // or if re-renders happen frequently.
      const animationDuration = 1000; // Should match the CSS animation duration.
      setTimeout(() => {
        setRipple(null);
      }, animationDuration);
    }
  };

  return { handleClick, component };
};

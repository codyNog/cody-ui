"use client";
import {
  useState,
  type ComponentProps,
  type RefObject,
  type MouseEvent, // Import MouseEvent for named import usage
} from "react";
import type { PressEvent } from "@react-types/shared"; // For PressEvent type
import styles from "./index.module.css";

export type RippleType = {
  key: number; // key はアニメーション識別のため残しても良いが、単一なら不要になる可能性も
  x: number;
  y: number;
  size: number;
};

type Props = {
  ripple: RippleType | null; // 単一のリップル、または null
  clearRipple: () => void; // リップルをクリアする関数
  isInputtingRef?: RefObject<boolean>; // ★ isInputtingRef を Props に追加
};

// clearRipple と isInputtingRef を Props に追加
const RippleComponent = ({ ripple, clearRipple, isInputtingRef }: Props) => {
  return (
    <span className={styles.rippleContainer}>
      {/* ripple が存在し、かつキー入力中でない場合のみ描画 */}
      {ripple && !isInputtingRef?.current && (
        <span
          key={ripple.key} // もし key を RippleType に残すなら使う
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          onAnimationEnd={clearRipple} // アニメーション終了時に clearRipple を呼ぶ
        />
      )}
    </span>
  );
};

export const useRipple = (isInputtingRef?: RefObject<boolean>) => {
  // isInputtingRef を追加
  const [ripple, setRipple] = useState<RippleType | null>(null); // 単一のリップル状態

  const clearRipple = () => {
    // リップルをクリアする関数を定義
    setRipple(null);
  };

  // Props の型から "ripple" と "clearRipple" を Omit する
  type RippleComponentProps = Omit<
    ComponentProps<typeof RippleComponent>,
    "ripple" | "clearRipple" | "isInputtingRef" // isInputtingRef も Omit 対象に追加
  >;

  const component = (props: RippleComponentProps) => {
    // RippleComponent に ripple, clearRipple, isInputtingRef を渡す
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
    ref: RefObject<any>, // Temporarily changed to any to resolve RefObject<SpecificElement | null> vs RefObject<Element> issues
  ) => {
    // If isInputtingRef is provided and its current value is true, do not create a ripple.
    if (isInputtingRef?.current) {
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      let x: number;
      let y: number;

      if ("clientX" in event && "clientY" in event) {
        // It's a MouseEvent (or has similar properties)
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else if ("x" in event && "y" in event) {
        // It's likely a PressEvent or similar with local coordinates
        // Ensure these are numbers if not strictly typed as PressEvent yet
        const pressX = event.x as number;
        const pressY = event.y as number;
        x = pressX;
        y = pressY;
      } else {
        // Fallback if coordinates cannot be determined
        // console.warn("Ripple: Could not determine click coordinates from event.", event);
        // Default to center or handle as an error case
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
      // Add a timeout to clear the ripple after the animation duration
      // This ensures the ripple is cleared even if onAnimationEnd doesn't fire as expected
      // or if re-renders happen frequently.
      const animationDuration = 1000; // Should match the CSS animation duration
      setTimeout(() => {
        setRipple(null);
      }, animationDuration);
    }
  };

  // setRipple (単数形) を返す
  return { handleClick, component };
};

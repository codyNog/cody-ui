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
  // handleAnimationEnd は不要になるので削除
};

const RippleComponent = ({ ripple }: Props) => {
  // handleAnimationEnd を引数から削除
  return (
    <span className={styles.rippleContainer}>
      {ripple && ( // ripple が存在する場合のみ描画
        <span
          key={ripple.key} // もし key を RippleType に残すなら使う
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          // onAnimationEnd は不要になるので削除
        />
      )}
    </span>
  );
};

export const useRipple = () => {
  const [ripple, setRipple] = useState<RippleType | null>(null); // 単一のリップル状態

  // Props の型から "ripple" と "handleAnimationEnd" (もしあれば) を Omit する
  // RippleComponentPropsからhandleAnimationEndを除いた型を定義
  type RippleComponentProps = Omit<
    ComponentProps<typeof RippleComponent>,
    "ripple"
  >;

  const component = (props: RippleComponentProps) => {
    // RippleComponent には単一の ripple のみを渡す
    return <RippleComponent ripple={ripple} {...props} />;
  };

  const handleClick = (
    event: MouseEvent<globalThis.Element> | PressEvent,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ref: RefObject<any>, // Temporarily changed to any to resolve RefObject<SpecificElement | null> vs RefObject<Element> issues
  ) => {
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
    }
  };

  // setRipple (単数形) を返す
  return { handleClick, component };
};

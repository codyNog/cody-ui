"use client";
import { useState } from "react";
import styles from "./index.module.css";

export type RippleType = {
  key: number;
  x: number;
  y: number;
  size: number;
};

type Props = {
  ripples: RippleType[];
  handleAnimationEnd: (key: number) => void;
};

const RippleComponent = ({ ripples, handleAnimationEnd }: Props) => {
  return (
    <span className={styles.rippleContainer}>
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          onAnimationEnd={() => handleAnimationEnd(ripple.key)}
        />
      ))}
    </span>
  );
};

export const useRipple = () => {
  const [ripples, setRipples] = useState<RippleType[]>([]); // Initialize state here

  const component = (props: Omit<Props, "ripples">) => {
    return <RippleComponent ripples={ripples} {...props} />;
  };

  return { ripples, setRipples, component };
};

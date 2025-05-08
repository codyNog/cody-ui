"use client";
import { forwardRef } from "react";

type Mode = "continuous" | "discrete" | "centered";

type Variant = "number" | "range";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  mode: Mode;
  variant: Variant;
};

export const Slider = forwardRef<HTMLDivElement, Props>((_props, ref) => {
  return <div ref={ref}>Slider</div>;
});

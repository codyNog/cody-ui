"use client";
import { forwardRef } from "react";
import { FilledTextField } from "./Filled";
import { OutlinedTextField } from "./Outlined";
import type { Props } from "./types";

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ variant = "filled", ...props }: Props, ref) => {
    if (variant === "outlined") {
      return <OutlinedTextField {...props} ref={ref} />;
    }

    return <FilledTextField {...props} ref={ref} />;
  },
);

TextField.displayName = "TextField";

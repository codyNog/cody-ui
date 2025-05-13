"use client";
import { forwardRef } from "react";
import { FilledTextField } from "./Filled";
import { OutlinedTextField } from "./Outlined";
import type { Props } from "./types";

/**
 * TextField component that can render either a FilledTextField or an OutlinedTextField
 * based on the `variant` prop.
 *
 * @param props - The properties for the TextField component.
 * @param ref - Forwarded ref to the underlying input element.
 */
export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ variant = "filled", ...props }: Props, ref) => {
    if (variant === "outlined") {
      return <OutlinedTextField {...props} ref={ref} />;
    }

    return <FilledTextField {...props} ref={ref} />;
  },
);

TextField.displayName = "TextField";

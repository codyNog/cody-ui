"use client";
import { forwardRef } from "react";
// Remove direct imports from react-aria-components if not needed here
// import type { TextFieldProps as AriaTextFieldProps, ValidationResult } from "react-aria-components";
import { FilledTextField } from "./Filled"; // Import Filled variant
import { OutlinedTextField } from "./Outlined"; // Import Outlined variant
import type { Props } from "./types"; // Import the shared Props type

// Remove local Props definition, use the imported one

export const TextField = forwardRef<HTMLInputElement, Props>(
  // Use imported Props
  (
    {
      variant = "filled", // Default to filled
      ...props // Pass all other props down
    }: Props,
    ref,
  ) => {
    // Render the appropriate variant based on the prop
    if (variant === "outlined") {
      return <OutlinedTextField {...props} ref={ref} />;
    }

    // Default to FilledTextField
    return <FilledTextField {...props} ref={ref} />;
  },
);

TextField.displayName = "TextField";

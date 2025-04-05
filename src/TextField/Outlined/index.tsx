"use client";
import { forwardRef } from "react";
import {
  // Remove FieldError, using Text now
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type ValidationResult, // Keep ValidationResult for error message handling
} from "react-aria-components";
import styles from "./index.module.css"; // Use its own CSS module
import type { Props as CommonProps } from "../types"; // Import the shared Props type

// Define Props specific to OutlinedTextField, extending the common Props
type Props = Omit<CommonProps, "variant">; // Omit variant

export const OutlinedTextField = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      description,
      errorMessage, // Keep receiving errorMessage prop
      ...props
    }: Props,
    ref,
  ) => {
    // Determine invalid state based on errorMessage prop
    const isInvalid = !!errorMessage;

    return (
      // Add wrapper div like FilledTextField
      <div className={styles.wrapper}>
        <AriaTextField
          {...props}
          isInvalid={isInvalid} // Pass invalid state
          // Apply container styles directly to AriaTextField
          className={
            `${styles.container} ${styles.outlined} ${
              isInvalid ? styles.invalid : "" // Use the calculated isInvalid
            } ${props.isDisabled ? styles.disabled : ""}`.trim() // Use props.isDisabled
          }
        >
          {/* Label, Input, Fieldset, Legend remain inside AriaTextField */}
          {label && <Label className={styles.label}>{label}</Label>}

          {/* Fieldset/Legend are purely for the border notch effect */}
          <fieldset aria-hidden="true" className={styles.fieldset}>
            <legend className={styles.legend}>
              {/* Render label inside span for padding, or non-breaking space if no label */}
              <span>{label ? label : "\u00A0"}</span>
            </legend>
          </fieldset>

          {/* Input is now a direct child, positioned relative to the container */}
          <Input ref={ref} className={styles.input} />

          {/* Description and Error rendering moved OUTSIDE AriaTextField */}
        </AriaTextField>

        {/* Container for supporting text like FilledTextField */}
        <div className={styles.supportingTextContainer}>
          {/* Render supporting text OUTSIDE AriaTextField, but inside the wrapper */}
          {!isInvalid && description && (
            <Text slot="description" className={styles.description}>
              {description}
            </Text>
          )}
          {/* Render error message OUTSIDE AriaTextField using Text */}
          {isInvalid && (
            <Text slot="errorMessage" className={styles.error}>
              {/* Handle string or ValidationResult like FilledTextField */}
              {typeof errorMessage === "string"
                ? errorMessage
                : (errorMessage as ValidationResult)?.validationErrors?.join(" ") ||
                  "Invalid input"}
            </Text>
          )}
        </div>
      </div>
    );
  },
);

OutlinedTextField.displayName = "OutlinedTextField";

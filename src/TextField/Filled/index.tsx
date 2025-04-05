"use client";
import { forwardRef } from "react";
import {
  // FieldError, // Render error manually outside
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  // Remove AriaTextFieldProps import as it's handled in types/index.ts
  // type TextFieldProps as AriaTextFieldProps,
  type ValidationResult, // Keep ValidationResult if needed directly, otherwise remove
} from "react-aria-components";
import styles from "./index.module.css"; // Use its own CSS module
import type { Props as CommonProps } from "../types"; // Import the shared Props type

// Define Props specific to FilledTextField, extending the common Props
// Note: variant is not needed here as this component IS the filled variant.
// We might need to omit variant from the imported Props if it exists there.
type Props = Omit<CommonProps, "variant">; // Omit variant if it's in CommonProps

export const FilledTextField = forwardRef<HTMLInputElement, Props>(
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
      // New wrapper div to hold the field and the supporting text below it
      <div className={styles.wrapper}>
        <AriaTextField
          {...props}
          // errorMessage={errorMessage} // <- Remove this line, AriaTextField doesn't accept it directly
          isInvalid={isInvalid} // Pass invalid state
          // Apply container styles directly to AriaTextField
          className={
            // No need for renderProps here if description/error are outside
            `${styles.container} ${styles.filled} ${
              isInvalid ? styles.invalid : "" // Use the calculated isInvalid
            } ${props.isDisabled ? styles.disabled : ""}`.trim() // Use props.isDisabled
          }
        >
          {/* Label and Input remain inside AriaTextField */}
          {label && <Label className={styles.label}>{label}</Label>}
          <Input ref={ref} className={styles.input} />

          {/* Description and Error rendering moved OUTSIDE AriaTextField */}
        </AriaTextField>

        {/* Container for supporting text to reserve space */}
        <div className={styles.supportingTextContainer}>
          {/* Render supporting text OUTSIDE AriaTextField, but inside the wrapper */}
          {!isInvalid && description && (
            <Text slot="description" className={styles.description}>
              {description}
            </Text>
          )}
          {/* Render error message OUTSIDE AriaTextField */}
          {isInvalid && (
            // Render the error message content using Text component
            <Text slot="errorMessage" className={styles.error}>
              {/* Handle string or ValidationResult */}
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

"use client";
import {
  type Ref,
  type RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  TextField as AriaTextField,
  Input,
  Label,
  TextArea,
  type ValidationResult,
} from "react-aria-components";
import { Typography } from "../../Typography";
import type { Props } from "../types";
import styles from "./index.module.css";

export const FilledTextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement, // Update ref type
  Props
>(
  (
    {
      label,
      description,
      errorMessage,
      multiline,
      maxLines,
      onChangeText,
      value: controlledValue, // Use controlled value from props
      startAdornment, // Destructure startAdornment
      endAdornment, // Destructure endAdornment
      ...props
    }: Props,
    forwardedRef,
  ) => {
    const isInvalid = !!errorMessage;
    const localRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    // Combine forwardedRef and localRef
    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(localRef.current);
      } else {
        (
          forwardedRef as RefObject<
            HTMLInputElement | HTMLTextAreaElement | null
          >
        ).current = localRef.current;
      }
    }, [forwardedRef]);

    // Function to adjust height, memoized with useCallback
    const adjustHeight = useCallback(() => {
      if (multiline && localRef.current instanceof HTMLTextAreaElement) {
        const textarea = localRef.current;
        textarea.style.height = "auto"; // Reset height to correctly calculate scrollHeight

        requestAnimationFrame(() => {
          const scrollHeight = textarea.scrollHeight;
          if (maxLines) {
            const computedStyle = window.getComputedStyle(textarea);
            const lineHeight =
              Number.parseFloat(computedStyle.lineHeight) || 16;
            const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
            const paddingBottom =
              Number.parseFloat(computedStyle.paddingBottom) || 0;
            const borderTop =
              Number.parseFloat(computedStyle.borderTopWidth) || 0;
            const borderBottom =
              Number.parseFloat(computedStyle.borderBottomWidth) || 0;
            const maxHeight =
              lineHeight * maxLines +
              paddingTop +
              paddingBottom +
              borderTop +
              borderBottom;

            if (scrollHeight > maxHeight) {
              textarea.style.height = `${maxHeight}px`;
              textarea.style.overflowY = "auto";
            } else {
              textarea.style.height = `${scrollHeight}px`;
              textarea.style.overflowY = "hidden";
            }
          } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = "hidden";
          }
        });
      } else if (!multiline && localRef.current instanceof HTMLInputElement) {
        localRef.current.style.height = "";
        localRef.current.style.overflowY = "";
      }
    }, [multiline, maxLines]);

    // Adjust height on initial render and value change
    useEffect(() => {
      adjustHeight();
    }, [adjustHeight]); // Remove controlledValue from dependencies

    return (
      <div className={styles.wrapper}>
        <AriaTextField
          value={controlledValue}
          onChange={onChangeText}
          isInvalid={isInvalid}
          className={`${styles.container} ${styles.filled} ${
            isInvalid ? styles.invalid : ""
          } ${props.isDisabled ? styles.disabled : ""}`.trim()}
          style={multiline ? { height: "auto", minHeight: "56px" } : {}}
          {...props}
        >
          {label && (
            <Label className={styles.label}>
              <Typography
                variant="bodyLarge"
                color={isInvalid ? "error" : "onSurfaceVariant"}
              >
                {label}
              </Typography>
            </Label>
          )}

          {/* Container for input and adornments */}
          <div className={styles.inputContainer}>
            {/* Render start adornment if provided */}
            {startAdornment && (
              <div className={styles.startAdornment}>{startAdornment}</div>
            )}

            {/* Conditionally render Input or TextArea */}
            {multiline ? (
              <TextArea
                ref={localRef as Ref<HTMLTextAreaElement>}
                className={`${styles.input} ${styles.textarea} ${
                  startAdornment ? styles.inputWithStartAdornment : ""
                } ${endAdornment ? styles.inputWithEndAdornment : ""}`.trim()}
              />
            ) : (
              <Input
                ref={localRef as Ref<HTMLInputElement>}
                className={`${styles.input} ${
                  startAdornment ? styles.inputWithStartAdornment : ""
                } ${endAdornment ? styles.inputWithEndAdornment : ""}`.trim()}
              />
            )}

            {/* Render end adornment if provided */}
            {endAdornment && (
              <div className={styles.endAdornment}>{endAdornment}</div>
            )}
          </div>
        </AriaTextField>

        {/* Container for supporting text to reserve space */}
        <div className={styles.supportingTextContainer}>
          {!isInvalid && description && (
            <Typography
              variant="bodySmall"
              color="onSurfaceVariant"
              slot="description"
            >
              {description}
            </Typography>
          )}
          {isInvalid && (
            <Typography variant="bodySmall" color="error" slot="errorMessage">
              {typeof errorMessage === "string"
                ? errorMessage
                : (errorMessage as ValidationResult)?.validationErrors?.join(
                    " ",
                  ) || "Invalid input"}
            </Typography>
          )}
        </div>
      </div>
    );
  },
);

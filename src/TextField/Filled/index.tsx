"use client";
import {
  type Ref,
  type RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState, // Add useState
} from "react";
import {
  TextField as AriaTextField,
  Input,
  Label,
  TextArea,
  type ValidationResult,
} from "react-aria-components";
import { useRipple } from "../../Ripple";
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
    const rippleRef = useRef<HTMLDivElement>(null);
    const isInputtingRef = useRef(false); // ★キー入力中フラグ
    const { handleClick, component: RippleEffect } = useRipple(isInputtingRef); // ★useRippleに渡す
    const [isActuallyFocused, setIsActuallyFocused] = useState(false); // State for focus

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
          const computedStyle = window.getComputedStyle(textarea);
          const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
          const paddingBottom =
            Number.parseFloat(computedStyle.paddingBottom) || 0;
          // const borderTop = Number.parseFloat(computedStyle.borderTopWidth) || 0; // Unused
          // const borderBottom = Number.parseFloat(computedStyle.borderBottomWidth) || 0; // Unused

          if (maxLines) {
            const lineHeight =
              Number.parseFloat(computedStyle.lineHeight) || 24;
            const targetContentHeight = lineHeight * maxLines;
            const targetStyleHeight =
              targetContentHeight + paddingBottom + paddingTop; // Include both paddings for Filled
            textarea.style.height = `${targetStyleHeight}px`;

            const currentContentHeight =
              scrollHeight - paddingTop - paddingBottom;
            if (currentContentHeight > targetContentHeight) {
              textarea.style.overflowY = "auto";
            } else {
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
        <div
          ref={rippleRef}
          onKeyDown={() => {}}
          className={`${styles.container} ${styles.filled} ${
            isInvalid ? styles.invalid : ""
          } ${props.isDisabled ? styles.disabled : ""} ${
            multiline ? styles.multilineContainer : ""
          }`.trim()}
          style={multiline ? { height: "auto", minHeight: "56px" } : {}}
        >
          <AriaTextField
            value={controlledValue}
            onChange={onChangeText}
            isInvalid={isInvalid}
            {...props}
          >
            {label && (
              <Label
                className={`${styles.label} ${
                  multiline ? styles.multilineLabel : ""
                }`}
              >
                <Typography
                  variant="bodyLarge"
                  color={
                    isInvalid
                      ? "error"
                      : isActuallyFocused
                        ? "primary"
                        : "onSurfaceVariant"
                  }
                >
                  {label}
                </Typography>
              </Label>
            )}

            {/* Container for input and adornments */}
            <div
              className={`${styles.inputContainer} ${
                multiline ? styles.multiline : ""
              }`}
            >
              {/* Render start adornment if provided */}
              {startAdornment && (
                <div className={styles.startAdornment}>{startAdornment}</div>
              )}

              {/* Conditionally render Input or TextArea */}
              {multiline ? (
                <TextArea
                  ref={localRef as Ref<HTMLTextAreaElement>}
                  className={`${styles.input} ${styles.textarea} ${
                    multiline ? styles.multiline : ""
                  } ${
                    startAdornment ? styles.inputWithStartAdornment : ""
                  } ${endAdornment ? styles.inputWithEndAdornment : ""}`.trim()}
                  onFocus={() => setIsActuallyFocused(true)}
                  onBlur={() => setIsActuallyFocused(false)}
                  onClick={(e) => {
                    if (e.isTrusted) {
                      handleClick(e, rippleRef);
                    }
                  }}
                  onKeyDown={() => {
                    isInputtingRef.current = true;
                  }}
                  onKeyUp={() => {
                    isInputtingRef.current = false;
                  }}
                />
              ) : (
                <Input
                  ref={localRef as Ref<HTMLInputElement>}
                  className={`${styles.input} ${
                    startAdornment ? styles.inputWithStartAdornment : ""
                  } ${endAdornment ? styles.inputWithEndAdornment : ""}`.trim()}
                  onFocus={() => setIsActuallyFocused(true)}
                  onBlur={() => setIsActuallyFocused(false)}
                  onClick={(e) => {
                    if (e.isTrusted) {
                      handleClick(e, rippleRef);
                    }
                  }}
                  onKeyDown={() => {
                    isInputtingRef.current = true;
                  }}
                  onKeyUp={() => {
                    isInputtingRef.current = false;
                  }}
                />
              )}

              {/* Render end adornment if provided */}
              {endAdornment && (
                <div className={styles.endAdornment}>{endAdornment}</div>
              )}
            </div>
          </AriaTextField>
          <RippleEffect />
        </div>

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

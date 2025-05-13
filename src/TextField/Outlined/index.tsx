"use client";
import {
  type Ref,
  type RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect, // Add useLayoutEffect
  useRef,
  useState,
} from "react";
import {
  TextField as AriaTextField,
  Input,
  Label,
  TextArea,
  type ValidationResult,
} from "react-aria-components";
// ReactNode is only used in the imported type, no need to import here directly
import { useRipple } from "../../Ripple";
import { Typography } from "../../Typography";
import type { Props } from "../types";
import styles from "./index.module.css";

export const OutlinedTextField = forwardRef<
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
      value: controlledValue, // Use controlled value
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
    const { handleClick, component: RippleEffect } = useRipple(isInputtingRef);
    const [isActuallyFocused, setIsActuallyFocused] = useState(false);
    const legendRef = useRef<HTMLLegendElement>(null); // Ref for the legend element
    const labelTextRef = useRef<HTMLSpanElement>(null); // Ref for the span inside legend to measure width

    // Calculate and set legend width
    useLayoutEffect(() => {
      if (labelTextRef.current && legendRef.current) {
        const labelTextWidth = labelTextRef.current.offsetWidth;
        // The notch width is the label's scaled width (0.75).
        // The legend's own padding (0 8px in CSS) will create the space around the scaled label.
        const notchWidth = labelTextWidth * 0.75;
        legendRef.current.style.setProperty(
          "--legend-max-width",
          `${notchWidth}px`,
        );
      }
    }, []); // Calculate on initial mount and if refs change (though refs changing is rare)

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
          ref={(node) => {
            if (typeof rippleRef === "function") {
              (rippleRef as (instance: HTMLDivElement | null) => void)(node);
            } else if (rippleRef) {
              rippleRef.current = node as HTMLDivElement | null;
            }
          }}
          onKeyDown={() => {}}
          className={`${styles.container} ${styles.outlined} ${
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

            {/* Fieldset/Legend are purely for the border notch effect */}
            <fieldset aria-hidden="true" className={styles.fieldset}>
              <legend ref={legendRef} className={styles.legend}>
                {/* Span to measure the actual text width, hidden from view but used for calculation */}
                <span
                  ref={labelTextRef}
                  style={{
                    position: "absolute",
                    visibility: "hidden",
                    whiteSpace: "nowrap",
                    // Ensure it uses the same typography for accurate measurement
                    // These should match the Typography component's "bodyLarge" variant
                    fontFamily:
                      "var(--md-sys-typescale-body-large-font-family-name)",
                    fontWeight:
                      "var(--md-sys-typescale-body-large-font-weight)",
                    fontSize: "var(--md-sys-typescale-body-large-font-size)",
                    letterSpacing:
                      "var(--md-sys-typescale-body-large-letter-spacing)",
                    lineHeight:
                      "var(--md-sys-typescale-body-large-line-height)",
                  }}
                >
                  {label ? label : "\u00A0"}
                </span>
                {/* This Typography is what's actually visible in the notch */}
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
                  {label ? label : "\u00A0"}
                </Typography>
              </legend>
            </fieldset>

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

              {/* Conditionally render Input or TextArea using localRef */}
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

        {/* Container for supporting text like FilledTextField */}
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

OutlinedTextField.displayName = "OutlinedTextField";

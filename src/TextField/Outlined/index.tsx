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
  Text,
  TextArea,
  type ValidationResult,
} from "react-aria-components";
// ReactNode is only used in the imported type, no need to import here directly
import type { Props as CommonProps } from "../types";
import styles from "./index.module.css";

type Props = Omit<CommonProps, "variant">;

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
      onChange,
      value: controlledValue, // Use controlled value
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
        textarea.style.height = "auto"; // Reset height

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

    // Wrapped onChange handler
    const handleOnChange = useCallback(
      (value: string) => {
        onChange?.(value);
      },
      [onChange],
    );

    return (
      <div className={styles.wrapper}>
        <AriaTextField
          value={controlledValue}
          onChange={handleOnChange}
          isInvalid={isInvalid}
          className={`${styles.container} ${styles.outlined} ${
            isInvalid ? styles.invalid : ""
          } ${props.isDisabled ? styles.disabled : ""}`.trim()}
          style={multiline ? { height: "auto", minHeight: "56px" } : {}}
          {...props}
        >
          {label && <Label className={styles.label}>{label}</Label>}

          {/* Fieldset/Legend are purely for the border notch effect */}
          <fieldset aria-hidden="true" className={styles.fieldset}>
            <legend className={styles.legend}>
              <span>{label ? label : "\u00A0"}</span>
            </legend>
          </fieldset>

          {/* Container for input and adornments */}
          <div className={styles.inputContainer}>
            {/* Render start adornment if provided */}
            {startAdornment && (
              <div className={styles.startAdornment}>{startAdornment}</div>
            )}

            {/* Conditionally render Input or TextArea using localRef */}
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

        {/* Container for supporting text like FilledTextField */}
        <div className={styles.supportingTextContainer}>
          {!isInvalid && description && (
            <Text slot="description" className={styles.description}>
              {description}
            </Text>
          )}
          {isInvalid && (
            <Text slot="errorMessage" className={styles.error}>
              {typeof errorMessage === "string"
                ? errorMessage
                : (errorMessage as ValidationResult)?.validationErrors?.join(
                    " ",
                  ) || "Invalid input"}
            </Text>
          )}
        </div>
      </div>
    );
  },
);

OutlinedTextField.displayName = "OutlinedTextField";

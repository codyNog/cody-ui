"use client";
import type { DateValue } from "@internationalized/date";
import { type ReactElement, forwardRef } from "react"; // Import ReactElement
import type { Ref } from "react"; // Import Ref
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment,
  Label,
  Text,
  // Remove unused DateFieldProps, DateValue
  type ValidationResult,
} from "react-aria-components";
import {
  dateArrayToCalendarDateArray,
  dateRangeToCalendarDateRange,
  dateToCalendarDate,
} from "../../Calendar/modules";
// Import Props directly and DatePickerType
import type { DatePickerType, DatePickerValue, Props } from "../types";
import styles from "./index.module.css";

// Helper function to convert value based on type
const convertValueByType = <T extends DatePickerType>(
  value: DatePickerValue<T> | undefined,
  type: T,
): DateValue | undefined => {
  if (value === undefined) return undefined;

  if (type === "single") {
    return dateToCalendarDate(value as Date);
  } else if (type === "range") {
    // DateRangeは直接DateValueとして使用できないため、
    // 単一の日付（範囲の開始日）を返す
    const range = dateRangeToCalendarDateRange(value as Date[]);
    return range?.start;
  } else {
    // 複数選択の場合は最初の日付を返す
    const dates = dateArrayToCalendarDateArray(value as Date[]);
    return dates && dates.length > 0 ? dates[0] : undefined;
  }
};

// Calendar Icon SVG (Material Symbols - calendar_today)
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="currentColor"
  >
    <title>カレンダーを開く</title>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7v-5z" />
  </svg>
);

// 内部コンポーネントを使わずに直接forwardRefを使用
export const DatePickerInput = forwardRef(function DatePickerInput<
  T extends DatePickerType,
>(
  {
    label,
    description,
    errorMessage,
    textFieldVariant = "filled",
    isDisabled,
    required,
    onCalendarIconClick,
    value,
    defaultValue,
    type,
  }: Props<T> & { onCalendarIconClick?: () => void },
  ref: Ref<HTMLDivElement>,
) {
  const isInvalid = !!errorMessage;

  return (
    <div className={styles.wrapper}>
      <AriaDateField
        ref={ref}
        value={convertValueByType(value, type)}
        defaultValue={convertValueByType(defaultValue, type)}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isRequired={required}
        className={`${styles.container} ${styles[textFieldVariant]} ${
          isInvalid ? styles.invalid : ""
        } ${isDisabled ? styles.disabled : ""}`.trim()}
      >
        {/* Label */}
        {label && <Label className={styles.label}>{label}</Label>}

        {/* Outlined variant specific elements */}
        {textFieldVariant === "outlined" && (
          <fieldset aria-hidden="true" className={styles.fieldset}>
            <legend className={styles.legend}>
              {/* Use non-breaking space if label is empty for notch */}
              <span>{label ? label : "\u00A0"}</span>
            </legend>
          </fieldset>
        )}

        {/* Input Container */}
        <div className={styles.inputContainer}>
          <AriaDateInput className={styles.dateInput}>
            {(segment) => (
              <DateSegment segment={segment} className={styles.dateSegment} />
            )}
          </AriaDateInput>
          <div
            className={styles.endAdornment}
            onClick={onCalendarIconClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCalendarIconClick?.();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="カレンダーを開く"
          >
            <CalendarIcon />
          </div>
        </div>
      </AriaDateField>

      {/* Supporting Text Container */}
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
}) as <T extends DatePickerType>(
  props: Props<T> & {
    ref?: Ref<HTMLDivElement>;
    onCalendarIconClick?: () => void;
  },
) => ReactElement;

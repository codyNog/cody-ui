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
import { MdCalendarToday } from "../../Icons"; // react-icons/md からインポート
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
  }
  if (type === "range") {
    // DateRangeは直接DateValueとして使用できないため、
    // 単一の日付（範囲の開始日）を返す
    const range = dateRangeToCalendarDateRange(value as Date[]);
    return range?.start;
  }
  // 複数選択の場合は最初の日付を返す
  const dates = dateArrayToCalendarDateArray(value as Date[]);
  return dates && dates.length > 0 ? dates[0] : undefined;
};

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
            <MdCalendarToday />
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

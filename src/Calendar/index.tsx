"use client";
import { useCallback } from "react";
import { MultipleCalendar } from "./Multiple";
import { RangeCalendar } from "./Range";
import { SingleCalendar } from "./Single";
import {
  calendarDateArrayToDateArray,
  calendarDateRangeToDateRange,
  calendarDateToDate,
  dateArrayToCalendarDateArray,
  dateRangeToCalendarDateRange,
  dateToCalendarDate,
  isMultipleVariant,
  isRangeVariant,
  isSingleVariant,
} from "./modules";
import type { CalendarProps, CalendarVariant } from "./types";
import type { InternalDateRange, InternalDateValue } from "./types";

// --- Component ---

export const Calendar = <T extends CalendarVariant = "single">(
  props: CalendarProps<T>,
) => {
  // --- Range Variant ---
  if (isRangeVariant(props)) {
    const { value, defaultValue, onChange, ...rest } = props;

    const internalValue = dateRangeToCalendarDateRange(value);
    const internalDefaultValue = dateRangeToCalendarDateRange(defaultValue);

    const handleRangeChange = useCallback(
      (internalRange: InternalDateRange | null) => {
        if (onChange) {
          const externalRange = internalRange
            ? calendarDateRangeToDateRange(internalRange)
            : null;
          onChange(externalRange);
        }
      },
      [onChange],
    );

    return (
      <RangeCalendar
        {...rest}
        value={internalValue}
        defaultValue={internalDefaultValue}
        onChange={handleRangeChange}
      />
    );
  }

  // --- Multiple Variant ---
  if (isMultipleVariant(props)) {
    const { value, defaultValue, onChange, ...rest } = props;

    const internalValue = dateArrayToCalendarDateArray(value);
    const internalDefaultValue = dateArrayToCalendarDateArray(defaultValue);

    const handleMultipleChange = useCallback(
      (internalDates: InternalDateValue[]) => {
        // MultipleCalendar's onChange provides InternalDateValue[] directly
        if (onChange) {
          const externalDates = calendarDateArrayToDateArray(internalDates);
          onChange(externalDates);
        }
      },
      [onChange],
    );

    return (
      <MultipleCalendar
        {...rest}
        value={internalValue}
        defaultValue={internalDefaultValue}
        onChange={handleMultipleChange}
      />
    );
  }

  // --- Single Variant (Default) ---
  if (isSingleVariant(props)) {
    const { value, defaultValue, onChange, ...rest } = props;

    const internalValue = dateToCalendarDate(value);
    const internalDefaultValue = dateToCalendarDate(defaultValue);

    const handleSingleChange = useCallback(
      (internalDate: InternalDateValue | null) => {
        if (onChange) {
          const externalDate = internalDate
            ? calendarDateToDate(internalDate)
            : null;
          onChange(externalDate);
        }
      },
      [onChange],
    );

    return (
      <SingleCalendar
        {...rest}
        value={internalValue}
        defaultValue={internalDefaultValue}
        onChange={handleSingleChange}
      />
    );
  }

  // Should not be reached due to exhaustive checks
  throw new Error(`Unsupported calendar variant: ${props.variant}`);
};

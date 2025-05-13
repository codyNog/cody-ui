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

/**
 * A versatile Calendar component that supports single date selection,
 * multiple date selection, and date range selection.
 *
 * The component dynamically renders `SingleCalendar`, `MultipleCalendar`, or `RangeCalendar`
 * based on the `variant` prop. It also handles the conversion between
 * external `Date` objects and internal `CalendarDate` objects used by `react-aria-components`.
 *
 * @template T - The variant of the calendar, defaults to "single".
 * @param {CalendarProps<T>} props - The props for the Calendar component.
 * @returns {JSX.Element} The rendered calendar component based on the variant.
 * @throws {Error} If an unsupported calendar variant is provided.
 *
 * @example
 * ```tsx
 * // Single Date Picker
 * <Calendar variant="single" onChange={(date) => console.log(date)} />
 *
 * // Multiple Date Picker
 * <Calendar variant="multiple" onChange={(dates) => console.log(dates)} />
 *
 * // Date Range Picker
 * <Calendar variant="range" onChange={(range) => console.log(range)} />
 * ```
 */
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
};

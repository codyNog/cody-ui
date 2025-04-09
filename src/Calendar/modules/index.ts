import {
  type CalendarDate,
  CalendarDate as CalendarDateConstructor,
  getLocalTimeZone,
} from "@internationalized/date";
import type {
  ExternalDateArray,
  ExternalDateRange,
  InternalDateArray,
  InternalDateRange,
  IsVariant,
  MultipleCalendarProps,
  RangeCalendarProps,
  SingleCalendarProps,
} from "../types";

// --- Helper Functions ---

const timeZone = getLocalTimeZone();

// Date => CalendarDate
export const dateToCalendarDate = (
  date: Date | undefined,
): CalendarDate | undefined => {
  if (!date) return undefined;
  // Date オブジェクトから直接 年/月/日 を取得して CalendarDate を作成
  return new CalendarDateConstructor(
    date.getFullYear(),
    date.getMonth() + 1, // getMonth() is 0-indexed
    date.getDate(),
  );
};

// CalendarDate => Date
export const calendarDateToDate = (date: CalendarDate): Date => {
  return date.toDate(timeZone);
};

// ExternalDateRange (Date[]) => InternalDateRange ({ start: CalendarDate, end: CalendarDate })
export const dateRangeToCalendarDateRange = (
  range: ExternalDateRange | undefined, // ExternalDateRange is Date[]
): InternalDateRange | undefined => {
  if (!range || range.length < 2 || !range[0] || !range[1]) return undefined;
  // Use the first two elements as start and end
  const start = dateToCalendarDate(range[0]);
  const end = dateToCalendarDate(range[1]);
  // Ensure both start and end were successfully converted
  if (start && end) {
    // Return in the { start, end } format expected internally
    return { start, end };
  }
  return undefined;
};

// InternalDateRange ({ start: CalendarDate, end: CalendarDate }) => ExternalDateRange (Date[])
export const calendarDateRangeToDateRange = (
  range: InternalDateRange,
): ExternalDateRange => {
  // ExternalDateRange is Date[]
  // Return as a two-element array [startDate, endDate]
  return [calendarDateToDate(range.start), calendarDateToDate(range.end)];
};

// ExternalDateArray => InternalDateArray
export const dateArrayToCalendarDateArray = (
  dates: ExternalDateArray | undefined,
): InternalDateArray | undefined => {
  if (!dates) return undefined;
  // 常に変換できた要素を含む配列を返す（空配列の場合も含む）
  const calendarDates = dates
    .map(dateToCalendarDate)
    .filter(Boolean) as InternalDateArray;
  return calendarDates;
};

// InternalDateArray => ExternalDateArray
export const calendarDateArrayToDateArray = (
  dates: InternalDateArray,
): ExternalDateArray => {
  return dates.map(calendarDateToDate);
};

// --- 型ガード関数 ---

// variantが"single"かどうかを判定する型ガード
export const isSingleVariant: IsVariant<"single"> = (
  props,
): props is SingleCalendarProps => {
  return props.variant === undefined || props.variant === "single";
};

// variantが"range"かどうかを判定する型ガード
export const isRangeVariant: IsVariant<"range"> = (
  props,
): props is RangeCalendarProps => {
  return props.variant === "range";
};

// variantが"multiple"かどうかを判定する型ガード
export const isMultipleVariant: IsVariant<"multiple"> = (
  props,
): props is MultipleCalendarProps => {
  return props.variant === "multiple";
};

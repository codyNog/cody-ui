import {
  CalendarDate as CalendarDateConstructor,
  type CalendarDate,
  getLocalTimeZone,
} from "@internationalized/date";
import type {
  ExternalDateRange,
  ExternalDateArray,
  InternalDateRange,
  InternalDateArray,
  SingleCalendarProps,
  RangeCalendarProps,
  MultipleCalendarProps,
  IsVariant,
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

// ExternalDateRange => InternalDateRange
export const dateRangeToCalendarDateRange = (
  range: ExternalDateRange | undefined,
): InternalDateRange | undefined => {
  if (!range) return undefined;
  const start = dateToCalendarDate(range.start);
  const end = dateToCalendarDate(range.end);
  // start と end が両方とも有効な CalendarDate に変換できた場合のみ RangeValue を返す
  if (start && end) {
    return { start, end };
  }
  return undefined;
};

// InternalDateRange => ExternalDateRange
export const calendarDateRangeToDateRange = (
  range: InternalDateRange,
): ExternalDateRange => {
  return {
    start: calendarDateToDate(range.start),
    end: calendarDateToDate(range.end),
  };
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

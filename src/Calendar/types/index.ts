import type { CalendarDate, DateValue } from "@internationalized/date";
import type { ComponentProps } from "react";
import type {
  Calendar as AriaCalendar,
  CalendarProps as AriaCalendarPropsBase,
  RangeCalendarProps as AriaRangeCalendarPropsBase,
} from "react-aria-components";

// --- Common Type Definitions ---

// 外部インターフェース用の日付型
type ExternalDateValue = Date;
export type ExternalDateRange = Date[]; // Changed from { start: Date; end: Date }
export type ExternalDateArray = Date[];

// react-aria-components 用の内部日付型
export type InternalDateValue = CalendarDate;
export type InternalDateRange = { start: CalendarDate; end: CalendarDate };
export type InternalDateArray = CalendarDate[];

// --- Calendar Component Type Definitions ---

// react-aria-components から共通で使用するプロパティ
type CommonAriaProps = Omit<
  AriaCalendarPropsBase<DateValue>,
  "value" | "defaultValue" | "onChange" | "className" | "children"
> &
  Omit<
    AriaRangeCalendarPropsBase<DateValue>,
    "value" | "defaultValue" | "onChange" | "className" | "children"
  >;

// カレンダーの選択モード
export type CalendarVariant = "single" | "range" | "multiple";

// variantに基づいて値の型を決定
type ValueType<T extends CalendarVariant | undefined> = T extends "range"
  ? ExternalDateRange // Now Date[]
  : T extends "multiple"
    ? ExternalDateArray
    : ExternalDateValue;

// variantに基づいてonChangeの型を決定
type OnChangeType<T extends CalendarVariant | undefined> = T extends "range"
  ? (dateRange: ExternalDateRange | null) => void // Now (dates: Date[] | null) => void
  : T extends "multiple"
    ? (dates: ExternalDateArray) => void
    : (date: ExternalDateValue | null) => void;

// カレンダーコンポーネントのプロパティ
export type CalendarProps<T extends CalendarVariant = "single"> =
  CommonAriaProps & {
    variant?: T;
    value?: ValueType<T>;
    defaultValue?: ValueType<T>;
    onChange?: OnChangeType<T>;
  };

// 各バリアント用の特化型
export type SingleCalendarProps = CalendarProps<"single">;
export type RangeCalendarProps = CalendarProps<"range">;
export type MultipleCalendarProps = CalendarProps<"multiple">;

// 型ガード関数の型定義
export type IsVariant<T extends CalendarVariant> = (
  props: CalendarProps<CalendarVariant>,
) => props is CalendarProps<T>;

type MultipleSelectionCalendarProps = Omit<
  ComponentProps<typeof AriaCalendar>,
  "value" | "defaultValue" | "onChange"
> & {
  value?: InternalDateArray;
  defaultValue?: InternalDateArray;
  onChange?: (dates: DateValue[]) => void;
};

"use client";
import {
  type CalendarDate,
  CalendarDate as CalendarDateConstructor,
  isToday as checkIsToday,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  Calendar as AriaCalendar,
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  type DateValue,
} from "react-aria-components";
import styles from "../index.module.css";
import {
  dateArrayToCalendarDateArray,
  calendarDateArrayToDateArray,
} from "../modules";
import type { CalendarProps, MultipleSelectionCalendarProps } from "../types";

export const MultipleCalendar = (props: CalendarProps<"multiple">) => {
  const {
    value: multipleValueProp,
    defaultValue: multipleDefaultValueProp,
    onChange: multipleOnChangeProp,
    ...multipleRestProps
  } = props;

  const multipleValue = dateArrayToCalendarDateArray(multipleValueProp) || [];
  const multipleDefaultValue =
    dateArrayToCalendarDateArray(multipleDefaultValueProp) || [];

  // AriaCalendarの型に合わせて明示的に型変換
  const handleMultipleChange = (dates: DateValue[]) => {
    if (multipleOnChangeProp) {
      const calendarDates = dates.filter(
        (d): d is CalendarDate => d instanceof CalendarDateConstructor,
      );
      multipleOnChangeProp(calendarDateArrayToDateArray(calendarDates));
    }
  };

  // --- Render Calendar Cell ---
  const renderCell = (date: CalendarDate) => {
    // isTodayをここで計算
    const isToday = checkIsToday(date, getLocalTimeZone());

    return (
      <CalendarCell date={date} className={styles.cell}>
        {({ formattedDate }) => (
          <span
            data-today={isToday || undefined}
            className={styles.cellContent}
          >
            {formattedDate}
          </span>
        )}
      </CalendarCell>
    );
  };

  // --- Common Header and Grid Structure ---
  const calendarHeader = (
    <header className={styles.header}>
      <Button slot="previous">◀</Button>
      <Heading className={styles.heading} />
      <Button slot="next">▶</Button>
    </header>
  );

  const calendarGrid = (
    <CalendarGrid className={styles.grid}>
      <CalendarGridHeader className={styles.gridHeader}>
        {(day) => (
          <CalendarHeaderCell className={styles.headerCell}>
            {day}
          </CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody className={styles.gridBody}>
        {renderCell}
      </CalendarGridBody>
    </CalendarGrid>
  );

  // 複数選択をサポートするカスタムコンポーネント
  const MultipleSelectionCalendar = (props: MultipleSelectionCalendarProps) => {
    const { value, defaultValue, onChange, ...rest } = props;

    // 配列の最初の要素を使用するか、空の場合はundefinedを使用
    const singleValue = value && value.length > 0 ? value[0] : undefined;
    const singleDefaultValue =
      defaultValue && defaultValue.length > 0 ? defaultValue[0] : undefined;

    // 選択変更時のハンドラー
    const handleChange = (date: DateValue) => {
      if (onChange) {
        // 既存の選択に新しい日付を追加または削除
        if (value) {
          const dateExists = value.some((d) => d.compare(date) === 0);

          const newDates = dateExists
            ? value.filter((d) => d.compare(date) !== 0) // 削除
            : [...value, date]; // 追加

          onChange(newDates);
        } else {
          onChange([date]);
        }
      }
    };

    return (
      <AriaCalendar
        {...rest}
        value={singleValue}
        defaultValue={singleDefaultValue}
        onChange={handleChange}
      />
    );
  };

  return (
    <MultipleSelectionCalendar
      {...multipleRestProps}
      value={multipleValue}
      defaultValue={multipleDefaultValue}
      onChange={handleMultipleChange}
      className={styles.calendar}
    >
      {calendarHeader}
      {calendarGrid}
    </MultipleSelectionCalendar>
  );
};

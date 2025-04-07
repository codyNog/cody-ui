"use client";
import {
  type CalendarDate,
  CalendarDate as CalendarDateConstructor,
  isToday as checkIsToday,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  RangeCalendar as AriaRangeCalendar,
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
  dateRangeToCalendarDateRange,
  calendarDateRangeToDateRange,
} from "../modules";
import type { CalendarProps } from "../types";

export const RangeCalendar = (props: CalendarProps<"range">) => {
  const {
    value: rangeValueProp,
    defaultValue: rangeDefaultValueProp,
    onChange: rangeOnChangeProp,
    ...rangeRestProps
  } = props;

  const rangeValue = dateRangeToCalendarDateRange(rangeValueProp);
  const rangeDefaultValue = dateRangeToCalendarDateRange(rangeDefaultValueProp);

  const handleRangeChange = (
    internalRange: { start: DateValue; end: DateValue } | null,
  ) => {
    if (rangeOnChangeProp) {
      if (
        internalRange &&
        internalRange.start instanceof CalendarDateConstructor &&
        internalRange.end instanceof CalendarDateConstructor
      ) {
        rangeOnChangeProp(
          calendarDateRangeToDateRange({
            start: internalRange.start,
            end: internalRange.end,
          }),
        );
      } else {
        rangeOnChangeProp(null);
      }
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

  return (
    <AriaRangeCalendar
      {...rangeRestProps}
      value={rangeValue}
      defaultValue={rangeDefaultValue}
      onChange={handleRangeChange}
      className={styles.calendar}
    >
      {calendarHeader}
      {calendarGrid}
    </AriaRangeCalendar>
  );
};

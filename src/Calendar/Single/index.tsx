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
import { dateToCalendarDate, calendarDateToDate } from "../modules";
import type { CalendarProps } from "../types";

export const SingleCalendar = (props: CalendarProps<"single">) => {
  const {
    value: singleValueProp,
    defaultValue: singleDefaultValueProp,
    onChange: singleOnChangeProp,
    ...singleRestProps
  } = props;

  const singleValue = dateToCalendarDate(singleValueProp);
  const singleDefaultValue = dateToCalendarDate(singleDefaultValueProp);

  const handleSingleChange = (internalDate: DateValue | null) => {
    if (singleOnChangeProp) {
      if (internalDate instanceof CalendarDateConstructor) {
        singleOnChangeProp(calendarDateToDate(internalDate));
      } else {
        singleOnChangeProp(null);
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
    <AriaCalendar
      {...singleRestProps}
      value={singleValue}
      defaultValue={singleDefaultValue}
      onChange={handleSingleChange}
      className={styles.calendar}
    >
      {calendarHeader}
      {calendarGrid}
    </AriaCalendar>
  );
};

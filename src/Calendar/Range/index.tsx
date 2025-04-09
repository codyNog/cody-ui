"use client";
import {
  type CalendarDate,
  // CalendarDateConstructor removed as it's unused
  isToday as checkIsToday,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps, // Import base Aria props
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components";
import styles from "../index.module.css";
// Remove unused date conversion imports
import type { InternalDateRange } from "../types"; // Import internal type

// Define props based on internal types
type InternalRangeCalendarProps = Omit<
  AriaRangeCalendarProps<CalendarDate>, // Use CalendarDate here
  "value" | "defaultValue" | "onChange" // Omit original value/onChange
> & {
  value?: InternalDateRange; // Expect internal range type
  defaultValue?: InternalDateRange; // Expect internal range type
  onChange?: (value: InternalDateRange | null) => void; // Expect internal range type in callback
};

export const RangeCalendar = (props: InternalRangeCalendarProps) => {
  // Props are now already in the internal format, destructure directly
  const { value, defaultValue, onChange, ...rest } = props;

  // No need for handleRangeChange wrapper, pass onChange directly if it exists
  // const handleRangeChange = ... (Removed)

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
      {...rest} // Use rest directly
      value={value} // Pass internal value directly
      defaultValue={defaultValue} // Pass internal defaultValue directly
      onChange={onChange} // Pass internal onChange directly
      className={styles.calendar}
    >
      {calendarHeader}
      {calendarGrid}
    </AriaRangeCalendar>
  );
};

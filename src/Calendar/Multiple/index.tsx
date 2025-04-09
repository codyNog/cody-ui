"use client";
import {
  type CalendarDate,
  // CalendarDateConstructor removed as it's unused
  isToday as checkIsToday,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  Calendar as AriaCalendar,
  type CalendarProps as AriaCalendarProps, // Import base Aria props
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  type DateValue,
  Heading,
} from "react-aria-components";
import styles from "../index.module.css";
// Remove unused date conversion imports
import type { InternalDateArray } from "../types"; // Import internal type

// --- Internal Multiple Selection Calendar ---

// Define props for the internal multiple selection logic component
type InternalMultipleSelectionCalendarProps = Omit<
  AriaCalendarProps<CalendarDate>, // Use CalendarDate here
  "value" | "defaultValue" | "onChange" // Omit original value/onChange
> & {
  value?: InternalDateArray; // Expect internal array type
  defaultValue?: InternalDateArray; // Expect internal array type
  onChange?: (value: InternalDateArray) => void; // Expect internal array type in callback
};

// Custom component to handle multiple selection logic on top of AriaCalendar
const MultipleSelectionCalendar = (
  props: InternalMultipleSelectionCalendarProps,
) => {
  const { value = [], defaultValue, onChange, ...rest } = props;

  // AriaCalendar expects a single DateValue for its value prop for focus management.
  // We'll use the last selected date or undefined.
  const singleValue = value.length > 0 ? value[value.length - 1] : undefined;
  // defaultValue is tricky with multiple selection, Aria doesn't directly support it.
  // We'll pass the internal defaultValue's last element if present, but it might not behave as expected.
  const singleDefaultValue =
    defaultValue && defaultValue.length > 0
      ? defaultValue[defaultValue.length - 1]
      : undefined;

  // Handle date selection/deselection
  const handleChange = (date: DateValue) => {
    // Ensure we are working with CalendarDate from react-aria-components
    // Note: AriaCalendar might pass other DateValue types, filter them.
    if (!(date instanceof AriaCalendar.constructor)) {
      // Check if it's a CalendarDate from @internationalized/date if needed,
      // but AriaCalendar should primarily pass its own CalendarDate type.
      // For simplicity, we assume AriaCalendar passes its CalendarDate or compatible.
      // If other DateValue types need handling, add logic here.
      console.warn("Received non-CalendarDate DateValue:", date);
      return; // Or handle other DateValue types if necessary
    }
    const calendarDate = date as CalendarDate; // Cast to CalendarDate

    if (onChange) {
      const dateExists = value.some((d) => d.compare(calendarDate) === 0);
      let newDates: InternalDateArray; // Ensure the type is InternalDateArray (CalendarDate[])

      if (dateExists) {
        // Filter out the deselected date
        newDates = value.filter((d) => d.compare(calendarDate) !== 0);
      } else {
        // Add the new date
        newDates = [...value, calendarDate];
      }
      onChange(newDates); // Pass the correctly typed array
    }
  };

  return (
    <AriaCalendar
      {...rest}
      value={singleValue} // Use the last selected date for focus
      defaultValue={singleDefaultValue} // Pass potentially problematic defaultValue
      onChange={handleChange} // Handle selection changes
    />
  );
};

// --- Exported MultipleCalendar Component ---

// Define props based on internal types for the exported component
type InternalMultipleCalendarProps = Omit<
  AriaCalendarProps<CalendarDate>, // Base props from Aria
  "value" | "defaultValue" | "onChange" // Omit conflicting props
> & {
  value?: InternalDateArray; // Expect internal array type
  defaultValue?: InternalDateArray; // Expect internal array type
  onChange?: (value: InternalDateArray) => void; // Expect internal array type in callback
};

export const MultipleCalendar = (props: InternalMultipleCalendarProps) => {
  // Props are now already in the internal format
  const { value, defaultValue, onChange, ...rest } = props;

  // No need for conversion or handleMultipleChange wrapper

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

  // Use the internal MultipleSelectionCalendar component
  return (
    <MultipleSelectionCalendar
      {...rest} // Pass rest props
      value={value} // Pass internal value directly
      defaultValue={defaultValue} // Pass internal defaultValue directly
      onChange={onChange} // Pass internal onChange directly
      className={styles.calendar}
    >
      {calendarHeader}
      {calendarGrid}
    </MultipleSelectionCalendar>
  );
};

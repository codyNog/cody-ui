"use client";
import {
  type ReactElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Ref } from "react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components";
import { DatePickerInput } from "../Input";
import type { DatePickerType, DatePickerValue, Props } from "../types";
import styles from "./index.module.css";

// 内部コンポーネントを使わずに直接forwardRefを使用
export const DockedDatePicker = forwardRef(function DockedDatePicker(
  props: Props<DatePickerType>,
  ref: Ref<HTMLDivElement>,
) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { onChange, type } = props;

  // カレンダーアイコンクリック時の処理
  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // 日付選択時の処理
  const handleDateSelect = (date: Date | Date[]) => {
    if (onChange) {
      onChange(date as DatePickerValue<typeof type>);
    }
    setIsCalendarOpen(false);
  };

  // カレンダー外クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        containerRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // カレンダーコンポーネントの選択
  const renderCalendar = () => {
    return (
      <div className={styles.calendarContainer}>
        <Calendar
          aria-label="日付選択"
          onChange={(date) => {
            // 日付が選択されたときの処理
            if (date) {
              const selectedDate = new Date(
                date.year,
                date.month - 1,
                date.day,
              );
              handleDateSelect(selectedDate);
            }
          }}
        >
          <header className={styles.calendarHeader}>
            <Button slot="previous">前月</Button>
            <Heading />
            <Button slot="next">次月</Button>
          </header>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
        </Calendar>
      </div>
    );
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <DatePickerInput
        {...props}
        ref={ref}
        onCalendarIconClick={handleCalendarToggle}
      />

      {isCalendarOpen && (
        <div className={styles.calendar} ref={calendarRef}>
          {renderCalendar()}
        </div>
      )}
    </div>
  );
}) as <T extends DatePickerType>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;

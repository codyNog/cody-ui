"use client";
import {
  type ReactElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Button } from "../../Button";
import type { Ref } from "react";
import { Calendar } from "../../Calendar";
import { DatePickerInput } from "../Input";
import type { DatePickerType, DatePickerValue, Props } from "../types";
import styles from "./index.module.css";

export const DockedDatePicker = forwardRef(function DockedDatePicker(
  props: Props<DatePickerType>,
  ref: Ref<HTMLDivElement>,
) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  
  // 一時的な選択状態を管理するための内部状態
  const [tempValue, setTempValue] = useState<
    DatePickerValue<typeof props.type> | undefined
  >(props.value || props.defaultValue);

  const { value, defaultValue, onChange, type, ...restProps } = props;

  // 値が外部から変更された場合、内部状態も更新
  useEffect(() => {
    if (value !== undefined) {
      setTempValue(value);
    }
  }, [value]);

  // カレンダーアイコンクリック時の処理
  const handleCalendarToggle = useCallback(() => {
    setIsCalendarOpen((prev) => !prev);
  }, []);

  // 日付選択時の処理
  const handleDateSelect = useCallback(
    (selectedDate: DatePickerValue<typeof type>) => {
      setTempValue(selectedDate);
    },
    [type]
  );

  // キャンセルボタンクリック時の処理
  const handleCancel = useCallback(() => {
    setTempValue(value || defaultValue);
    setIsCalendarOpen(false);
  }, [value, defaultValue]);

  // OKボタンクリック時の処理
  const handleOk = useCallback(() => {
    if (onChange && tempValue !== undefined) {
      onChange(tempValue);
    }
    setIsCalendarOpen(false);
  }, [onChange, tempValue]);

  // カレンダー外クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // カレンダーとインプットの外側をクリックした場合のみ閉じる
      if (
        isCalendarOpen &&
        calendarRef.current &&
        inputRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // ESCキーでカレンダーを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isCalendarOpen) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCalendarOpen]);

  return (
    <div className={styles.wrapper}>
      <div ref={inputRef}>
        <DatePickerInput
          {...props}
          value={tempValue}
          ref={ref}
          onCalendarIconClick={handleCalendarToggle}
        />
      </div>

      {isCalendarOpen && (
        <div 
          className={styles.calendar} 
          ref={calendarRef}
          role="dialog"
          aria-modal="true"
          aria-label="日付選択ダイアログ"
        >
          <Calendar
            variant={type}
            value={tempValue}
            defaultValue={defaultValue}
            onChange={handleDateSelect}
            isDisabled={restProps.isDisabled}
            aria-label="日付選択カレンダー"
          />
          <div className={styles.actions}>
            <Button variant="text" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button variant="text" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}) as <T extends DatePickerType>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;

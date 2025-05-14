"use client";
import {
  type ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { Ref } from "react";
import { Button } from "../../Button";
import { Calendar } from "../../Calendar";
import { Tooltip } from "../../Tooltip";
import { DatePickerInput } from "../Input";
import type { DatePickerType, DatePickerValue, Props } from "../types";
import styles from "./index.module.css";

export const DockedDatePicker = forwardRef(function DockedDatePicker(
  props: Props<DatePickerType>,
  ref: Ref<HTMLDivElement>,
) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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
    [],
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

  const calendarContent = (
    <div
      className={styles.calendar}
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
  );

  return (
    <div className={styles.wrapper}>
      <Tooltip
        content={calendarContent}
        isOpen={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        variant="rich"
      >
        <DatePickerInput
          {...props}
          value={tempValue}
          ref={ref}
          onCalendarIconClick={handleCalendarToggle}
        />
      </Tooltip>
    </div>
  );
}) as <T extends DatePickerType>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;

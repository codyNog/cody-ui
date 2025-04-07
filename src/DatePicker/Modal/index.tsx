"use client";
import { type ReactElement, forwardRef } from "react";
import type { Ref } from "react";
import { DatePickerInput } from "../Input";
import type { DatePickerType, Props } from "../types";

// 内部コンポーネントを使わずに直接forwardRefを使用
export const ModalDatePicker = forwardRef(function ModalDatePicker(
  props: Props<DatePickerType>,
  ref: Ref<HTMLDivElement>,
) {
  // Inputをクリックするとモーダルが開いて日付選択
  return <DatePickerInput {...props} ref={ref} />;
}) as <T extends DatePickerType>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;

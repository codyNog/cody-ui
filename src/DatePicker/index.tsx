"use client";
import { type ReactElement, type Ref, forwardRef } from "react";
import { DockedDatePicker } from "./Docked";
import { ModalDatePicker } from "./Modal";
import type { DatePickerType, Props } from "./types";

// 内部コンポーネントを使わずに直接forwardRefを使用
export const DatePicker = forwardRef(function DatePicker(
  props: Props<DatePickerType>,
  ref: Ref<HTMLDivElement>,
) {
  if (props.variant === "docked") {
    return <DockedDatePicker {...props} ref={ref} />;
  }
  return <ModalDatePicker {...props} ref={ref} />;
}) as <T extends DatePickerType>(
  props: Props<T> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;

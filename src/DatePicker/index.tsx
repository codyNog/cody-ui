"use client";
import { type ReactElement, type Ref, forwardRef } from "react";
import { DockedDatePicker } from "./Docked";
import { ModalDatePicker } from "./Modal";
import type { DatePickerType, Props } from "./types";

/**
 * A DatePicker component that allows users to select a date.
 * It supports two main variants: "docked" and "modal".
 *
 * - The "docked" variant displays the calendar directly on the page, typically alongside an input field.
 * - The "modal" variant displays the calendar in a modal dialog, triggered by an input field.
 *
 * This component acts as a wrapper and delegates rendering to either
 * `DockedDatePicker` or `ModalDatePicker` based on the `variant` prop.
 *
 * @template T - The type of the date picker, extending `DatePickerType`.
 * @param {Props<T>} props - The props for the DatePicker component.
 * @param {Ref<HTMLDivElement>} ref - The ref to be forwarded to the underlying date picker component.
 * @returns {ReactElement} The rendered date picker component.
 *
 * @example
 * ```tsx
 * // Docked DatePicker
 * <DatePicker variant="docked" label="Select Date" />
 *
 * // Modal DatePicker
 * <DatePicker variant="modal" label="Event Date" />
 *
 * // With a default value
 * <DatePicker variant="modal" label="Start Date" defaultValue={new Date()} />
 * ```
 */
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

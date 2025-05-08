"use client";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { ToggleButtonGroupProps } from "react-aria-components";

/**
 * Represents a single item in the SegmentedButtons component.
 */
type SegmentedButtonItem = {
  /** The label text of the button. */
  label: string;
  /** The unique value associated with this button. */
  value: string;
  /** Optional icon to display in the button. */
  icon?: ReactNode;
  /** Whether the button is disabled. */
  disabled?: boolean;
};

// Props for single selection mode
type SingleSelectionProps = {
  mode: "single";
  /** The value of the selected button. Must be one of the item values. */
  value: string;
  /** Callback fired when the selection changes. */
  onChange?: (value: string) => void;
  /** The default selected value (for uncontrolled mode). Must be one of the item values. */
  defaultValue: string;
};

// Props for multiple selection mode
type MultipleSelectionProps = {
  mode: "multiple";
  /** The values of the selected buttons. An empty array means no selection. */
  value: string[];
  /** Callback fired when the selection changes. */
  onChange?: (values: string[]) => void;
  /** The default selected values (for uncontrolled mode). An empty array means no selection. */
  defaultValue: string[];
};

// Base props from ToggleButtonGroup, excluding those managed by SegmentedButtons
// Also, ensure 'aria-label' or 'aria-labelledby' is provided for accessibility.
type BaseToggleButtonGroupProps = Omit<
  ToggleButtonGroupProps,
  // These props are handled by the conditional types or have specific logic:
  // - value (handled by SingleSelectionProps or MultipleSelectionProps)
  // - defaultValue (handled by SingleSelectionProps or MultipleSelectionProps)
  // - onChange (handled by SingleSelectionProps or MultipleSelectionProps)
  // - isDisabled (handled by `disabled` prop at the top level of SegmentedButtonsProps)
  // - children (derived from `items` prop)
  // - className (handled with `styles` and `userClassName`)
  | "value"
  | "defaultValue"
  | "onChange"
  | "isDisabled"
  | "children"
  | "className"
  // style is kept if needed, but generally prefer CSS Modules
>;

// Common props for the SegmentedButtons component
type SegmentedButtonsCommonProps = BaseToggleButtonGroupProps & {
  /** Array of items to render as segmented buttons. Recommended length is 2-5. */
  items: SegmentedButtonItem[];
  /** Whether the entire group is disabled. This will override individual item's disabled state. */
  disabled?: boolean;
  /**
   * The `aria-label` attribute for the toggle button group.
   * This is required for accessibility if `aria-labelledby` is not provided.
   */
  "aria-label"?: string;
  /**
   * The `aria-labelledby` attribute for the toggle button group.
   * This is required for accessibility if `aria-label` is not provided.
   */
  "aria-labelledby"?: string;
};

/**
 * Props for the SegmentedButtons component.
 * The `onChange` and `value`/`defaultValue` props behave differently based on the `mode`.
 * Requires either `aria-label` or `aria-labelledby` for accessibility.
 */
type Props = SegmentedButtonsCommonProps &
  (SingleSelectionProps | MultipleSelectionProps);

export const SegmentedButtons = forwardRef<HTMLDivElement, Props>(
  (_props, ref) => {
    return <div ref={ref}>SegmentedButtons</div>;
  },
);

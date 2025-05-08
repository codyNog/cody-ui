"use client";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  type ToggleButtonGroupProps,
} from "react-aria-components";
import styles from "./index.module.css";

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
  // These props are handled by the conditional types or have specific logic within SegmentedButtons:
  | "value" // Handled by SingleSelectionProps or MultipleSelectionProps and passed conditionally
  | "defaultValue" // Handled by SingleSelectionProps or MultipleSelectionProps and passed conditionally
  | "onChange" // Handled by SingleSelectionProps or MultipleSelectionProps and passed conditionally
  | "isDisabled" // Handled by `disabled` prop at the top level of SegmentedButtonsProps
  | "children" // Derived from `items` prop
  | "className" // Handled with `styles` and potential userClassName
  | "selectionMode" // Determined internally by `mode` prop
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
  (props, ref) => {
    const {
      items,
      mode,
      value: controlledValue,
      defaultValue: uncontrolledDefaultValue,
      onChange,
      disabled: groupDisabled,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...restToggleButtonGroupProps
    } = props;

    // Props not handled by conditional types or specific logic are spread directly
    const basePropsForGroup = {
      isDisabled: groupDisabled, // This comes from SegmentedButtonsCommonProps
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...restToggleButtonGroupProps, // Spread other valid ToggleButtonGroupProps
    };

    if (mode === "single") {
      const {
        value: singleValue,
        defaultValue: singleDefaultValue,
        onChange: singleOnChange,
      } = props as SingleSelectionProps;

      const onPressButton = (value: string) => {
        singleOnChange?.(value);
      };

      return (
        <ToggleButtonGroup
          {...basePropsForGroup}
          ref={ref}
          selectionMode="single"
          selectedKeys={[
            singleValue,
          ]} /* For single selection, value is Key | null. Our prop is string. */
          defaultSelectedKeys={[singleDefaultValue]} /* ditto */
          className={styles.segmentedButtons}
        >
          {items.map((item) => (
            <ToggleButton
              key={item.value}
              id={item.value}
              isDisabled={groupDisabled || item.disabled}
              className={styles.button}
              onPress={() => onPressButton(item.value)}
            >
              {item.icon}
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      );
    }

    // mode === "multiple"
    const {
      value: multipleValue,
      defaultValue: multipleDefaultValue,
      onChange: multipleOnChange,
    } = props as MultipleSelectionProps;

    // valueがselectedKeyに含まれている時はselectedKeyからvalueを削除し、
    // 含まれていない時はselectedKeyにvalueを追加する
    const onPressButton = (value: string) => {
      if (multipleOnChange) {
        let updatedValues: string[];
        if (multipleValue.includes(value)) {
          updatedValues = multipleValue.filter((v) => v !== value);
        } else {
          updatedValues = [...multipleValue, value];
        }
        multipleOnChange(updatedValues);
      }
    };

    return (
      <ToggleButtonGroup
        {...basePropsForGroup}
        ref={ref}
        selectionMode="multiple"
        selectedKeys={
          multipleValue
        } /* For multiple selection, value is Key[]. Our prop is string[]. */
        defaultSelectedKeys={multipleDefaultValue} /* ditto */
        className={styles.segmentedButtons}
      >
        {items.map((item) => (
          <ToggleButton
            key={item.value}
            id={item.value} // id is used by ToggleButtonGroup to identify the item
            isDisabled={groupDisabled || item.disabled}
            className={styles.button}
            onPress={() => onPressButton(item.value)}
          >
            {item.icon}
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  },
);

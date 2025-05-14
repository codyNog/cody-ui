"use client";
import { type ForwardedRef, forwardRef } from "react";
import type { ReactNode } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from "react-aria-components";
import { MdCheck } from "../Icons";
import styles from "./index.module.css";

type Mode = "single" | "multiple";

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
type SingleProps = {
  mode: "single";
  /** The value of the selected button. Must be one of the item values. */
  value: string;
  /** Callback fired when the selection changes. */
  onChange?: (value: string) => void;
  /** The default selected value (for uncontrolled mode). Must be one of the item values. */
  defaultValue: string;
};

// Props for multiple selection mode
type MultipleProps = {
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
type BaseProps = Omit<
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
type CommonProps = BaseProps & {
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
type Props<V extends Mode> = CommonProps &
  (V extends "single" ? SingleProps : MultipleProps);

export const SegmentedButtons = forwardRef(
  <V extends Mode>(props: Props<V>, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      mode,
      value,
      defaultValue,
      items,
      disabled,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      onChange,
      ...rest
    }: Props<typeof props.mode> = props;

    const onPressButton = (key: string) => {
      if (!onChange) return;
      if (mode === "single") {
        onChange?.(key);
        return;
      }

      let updatedValues: string[];
      if (value.includes(key)) {
        updatedValues = value.filter((v) => v !== key);
      } else {
        updatedValues = [...value, key];
      }
      onChange(updatedValues);
    };

    return (
      <ToggleButtonGroup
        {...rest}
        ref={ref}
        selectionMode={mode}
        selectedKeys={mode === "single" ? [value] : value}
        defaultSelectedKeys={mode === "single" ? [defaultValue] : defaultValue}
        className={styles.segmentedButtons}
      >
        {items.map((item) => (
          <ToggleButton
            key={item.value}
            id={item.value}
            isDisabled={disabled || item.disabled}
            className={styles.button}
            onPress={() => onPressButton(item.value)}
          >
            {(state) => (
              <>
                {state.isSelected ? (
                  <MdCheck aria-hidden className={styles.icon} />
                ) : item.icon ? (
                  <span className={styles.icon}>{item.icon}</span>
                ) : (
                  <span
                    aria-hidden
                    className={styles.icon}
                    style={{ visibility: "hidden" }}
                  />
                )}
                <span className={styles.label}>{item.label}</span>
              </>
            )}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  },
);

"use client";
import { type MouseEvent, type ReactNode, type Ref, forwardRef } from "react";
import type { Key } from "react-aria-components";
import { Button } from "../Button";
import { MdArrowDropDown, MdClear } from "../Icons";
import { Menu } from "../Menu";
import { TextField } from "../TextField";
import styles from "./index.module.css";

/**
 * Represents a single option in the Select component.
 * @template T - The type of the option's value.
 */
type Option<T> = {
  /** The display label for the option. */
  label: string;
  /** The actual value of the option. */
  value: T;
};

/**
 * Props for the Select component.
 * @template T - The type of the value for the select options.
 */
type Props<T> = {
  /** An array of options to be displayed in the select dropdown. */
  options: Option<T>[];
  /** Callback function invoked when the selected value changes. */
  onChange: (value: T | undefined) => void;
  /** The currently selected value. */
  value: T | undefined;
  /** The label for the select field. */
  label: string;
  /** Whether the select field is disabled. */
  disabled?: boolean;
  /** Error message to display below the select field. */
  errorMessage?: string;
  /** Supporting text to display below the select field. */
  supportingText?: string;
  /** Optional icon to display at the beginning of the select field. */
  leadingIcon?: ReactNode;
  /** The visual variant of the select field. @default "filled" */
  variant?: "filled" | "outlined";
};

/**
 * Select component allows users to choose a single option from a list.
 * It integrates with TextField for display and Menu for the dropdown.
 * @template T - The type of the value for the select options, constrained to string or number.
 */
export const Select = forwardRef(function Select<T extends string | number>(
  props: Props<T>,
  ref: Ref<HTMLDivElement>,
) {
  const {
    options,
    onChange,
    value,
    label,
    disabled,
    errorMessage,
    supportingText,
    leadingIcon,
    variant = "filled",
  } = props;

  const selectedOption = options.find((option) => option.value === value);

  const menuItems = options.map((option) => ({
    id: String(option.value),
    label: option.label,
  }));

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1 }}>
      <TextField
        label={label}
        value={selectedOption?.label ?? ""}
        isReadOnly
        variant={variant}
        isDisabled={disabled}
        errorMessage={errorMessage}
        supportingText={supportingText}
        startAdornment={leadingIcon}
        endAdornment={selectedOption ? undefined : <MdArrowDropDown />}
      />
      {selectedOption && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear selection"
          className={styles.standaloneClearButton}
        >
          <MdClear />
        </button>
      )}
      <Menu
        items={menuItems}
        onAction={(key: Key) => {
          const selectedItem = options.find(
            (option) => String(option.value) === key,
          );
          if (selectedItem) {
            onChange(selectedItem.value as T);
          }
        }}
        matchTriggerWidth
      >
        <div className={styles.menuTriggerOverlayButtonContainer}>
          <Button variant="text" aria-label="Open menu">
            {null}
          </Button>
        </div>
      </Menu>
    </div>
  );
});

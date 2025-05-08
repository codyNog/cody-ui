"use client";
import { type MouseEvent, type ReactNode, type Ref, forwardRef } from "react";
import type { Key } from "react-aria-components";
import { Button } from "../Button";
import { MdArrowDropDown, MdClear } from "../Icons";
import { Menu } from "../Menu";
import { TextField } from "../TextField";
import styles from "./index.module.css"; // スタイルをインポート

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  options: Option<T>[];
  onChange: (value: T | undefined) => void;
  value: T | undefined;
  label: string;
  disabled?: boolean;
  errorMessage?: string;
  supportingText?: string;
  leadingIcon?: ReactNode;
  variant?: "filled" | "outlined";
};

export const Select = forwardRef(function Select<T extends string | number>(
  // T に制約を追加
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

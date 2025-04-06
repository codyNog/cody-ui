import { Checkbox as AriaCheckbox } from "react-aria-components";
import type { ReactNode } from "react";
import styles from "./index.module.css";

export type CheckBoxProps = {
  children?: ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange?: (isSelected: boolean) => void;
  value?: string;
  name?: string;
  isReadOnly?: boolean;
  isRequired?: boolean;
  "aria-label"?: string;
};

export function CheckBox({ children, ...props }: CheckBoxProps) {
  const {
    isSelected,
    defaultSelected,
    isIndeterminate,
    isDisabled,
    onChange,
    value,
    name,
    isReadOnly,
    isRequired,
    "aria-label": ariaLabel,
  } = props;

  return (
    <AriaCheckbox
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
      onChange={onChange}
      value={value}
      name={name}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      aria-label={ariaLabel}
      className={styles.root}
    >
      {(renderProps) => (
        <>
          <div className={styles.checkbox} aria-hidden="true">
            <svg viewBox="0 0 18 18" className={styles.icon} aria-hidden="true">
              {" "}
              {/* SVG自体もスクリーンリーダーから隠す */}
              <title>Checkbox icon</title> {/* Biomeエラー対応 */}
              {renderProps.isIndeterminate ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 8H14V10H4V8Z"
                /> // Indeterminate icon path (from Material Symbols)
              ) : renderProps.isSelected ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.59998 12.4L3.59998 9.4L4.99998 8L6.59998 9.6L13 3.2L14.4 4.6L6.59998 12.4Z"
                /> // Checked icon path (from Material Symbols)
              ) : null}
            </svg>
          </div>
          {children ?? renderProps.defaultChildren}{" "}
          {/* children があればそれを、なければデフォルトを使う */}
        </>
      )}
    </AriaCheckbox>
  );
}

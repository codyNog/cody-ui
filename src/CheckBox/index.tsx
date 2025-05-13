import { Checkbox as AriaCheckbox } from "react-aria-components";
import { MdCheck, MdRemove } from "../Icons";
import styles from "./index.module.css";

/**
 * Props for the Checkbox component.
 */
type Props = {
  /** The value associated with the checkbox. */
  value?: string;
  /** The name of the checkbox, used when submitting an HTML form. */
  name?: string;
  /** Whether the checkbox is read-only. */
  isReadOnly?: boolean;
  /** An accessibility label for the checkbox, used when a visible label is not provided. */
  "aria-label"?: string;
  /**
   * The controlled checked state of the checkbox.
   * Can be `true`, `false`, or `"indeterminate"`.
   */
  checked?: boolean | "indeterminate";
  /** Whether the checkbox is required. */
  required?: boolean;
  /** Whether the checkbox is disabled. */
  disabled?: boolean;
  /** Callback fired when the checked state changes. */
  onChangeChecked?: (isSelected: boolean) => void;
  /** A visible label for the checkbox. If provided, `aria-label` will be ignored. */
  label?: string;
};

/**
 * A Checkbox component that allows users to select one or more options from a set.
 * It supports checked, unchecked, and indeterminate states.
 *
 * @example
 * ```tsx
 * <Checkbox label="Subscribe to newsletter" />
 *
 * <Checkbox checked onChangeChecked={(isSelected) => console.log(isSelected)} />
 *
 * <Checkbox checked="indeterminate" label="Select all" />
 *
 * <Checkbox disabled label="Disabled checkbox" />
 * ```
 */
export const Checkbox = (props: Props) => {
  const {
    checked,
    disabled,
    onChangeChecked,
    name,
    isReadOnly,
    required,
    "aria-label": ariaLabel,
    label,
  } = props;

  const isSelected = typeof checked === "boolean" ? checked : false;
  const isIndeterminate = checked === "indeterminate";

  return (
    <AriaCheckbox
      isSelected={isSelected}
      defaultSelected={
        typeof props.checked === "boolean" ? props.checked : undefined
      }
      isIndeterminate={isIndeterminate}
      isDisabled={disabled}
      onChange={onChangeChecked}
      name={name}
      isReadOnly={isReadOnly}
      isRequired={required}
      aria-label={label ? undefined : ariaLabel}
      className={styles.root}
    >
      {(renderProps) => (
        <>
          <div className={styles.checkbox} aria-hidden="true">
            <span className={styles.stateLayer} />
            {renderProps.isIndeterminate ? (
              <MdRemove className={styles.icon} aria-hidden="true" />
            ) : renderProps.isSelected ? (
              <MdCheck className={styles.icon} aria-hidden="true" />
            ) : null}
          </div>
          {label && <span className={styles.labelText}>{label}</span>}
        </>
      )}
    </AriaCheckbox>
  );
};

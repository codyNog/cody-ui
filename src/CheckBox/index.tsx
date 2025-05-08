import { Checkbox as AriaCheckbox } from "react-aria-components";
import { MdCheck, MdRemove } from "../Icons"; // react-icons/md からインポート
import styles from "./index.module.css";

type Props = {
  value?: string;
  name?: string;
  isReadOnly?: boolean;
  "aria-label"?: string;
  checked?: boolean | "indeterminate";
  required?: boolean;
  disabled?: boolean;
  onChangeChecked?: (isSelected: boolean) => void;
  label?: string; // ★ ラベル用のpropsを追加
};

export const Checkbox = (props: Props) => {
  const {
    checked,
    disabled,
    onChangeChecked,
    name,
    isReadOnly,
    required,
    "aria-label": ariaLabel,
    label, // ★ labelをpropsから取得
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
      aria-label={label ? undefined : ariaLabel} // ★ labelがある場合はaria-labelを使わない
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

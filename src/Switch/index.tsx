import type { ReactNode } from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { MdCheck } from "../Icons";
import styles from "./index.module.css";

/**
 * Props for the Switch component.
 */
type Props = AriaSwitchProps & {
  /** Optional icon to display within the switch thumb. Defaults to a checkmark when selected and no icon is provided. */
  icon?: ReactNode;
  /** Whether the switch is currently checked (controlled). */
  checked?: boolean;
};

/**
 * Switches toggle the state of a single setting on or off.
 * They are the preferred way to adjust settings on mobile.
 * Based on Material Design 3 guidelines and built using react-aria-components.
 *
 * @see https://m3.material.io/components/switch/overview
 * @see https://react-spectrum.adobe.com/react-aria/Switch.html
 */
export const Switch = ({
  icon,
  className,
  children,
  checked,
  ...props
}: Props) => {
  const renderIcon = (isSelected: boolean) => {
    if (icon) {
      return icon;
    }
    if (isSelected) {
      return <MdCheck />;
    }
    return null;
  };

  return (
    <AriaSwitch
      {...props}
      isSelected={checked}
      className={(renderProps) =>
        [
          styles.root,
          renderProps.isSelected ? "selected" : "",
          renderProps.isDisabled ? "disabled" : "",
          renderProps.isFocusVisible ? "focus-visible" : "",
          renderProps.isPressed ? "pressed" : "",
          icon || renderProps.isSelected ? styles.withIcon : "",
          typeof className === "function"
            ? className(renderProps)
            : (className ?? ""),
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {(renderProps) => {
        const currentIcon = renderIcon(renderProps.isSelected);
        return (
          <>
            <div className={styles.track}>
              <div className={styles.thumb}>
                {currentIcon && (
                  <div className={styles.icon}>{currentIcon}</div>
                )}
              </div>
            </div>
            {children}
          </>
        );
      }}
    </AriaSwitch>
  );
};

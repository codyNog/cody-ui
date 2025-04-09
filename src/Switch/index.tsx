import type { ReactNode } from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import styles from "./index.module.css";

type SwitchProps = AriaSwitchProps & {
  /** Optional icon to display within the switch thumb */
  icon?: ReactNode;
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
}: SwitchProps) => {
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
          // icon ? styles.icon : "", // Remove this - styles.icon is for the icon element itself
          typeof className === "function"
            ? className(renderProps)
            : (className ?? ""),
        ]
          .filter(Boolean)
          .join(" ")
      }
      // data-* attributes are automatically handled by react-aria-components based on props
      // We rely on the className render prop to apply state-based styles
      // Add data-icon manually as it's a custom prop
      data-icon={icon ? "" : undefined}
    >
      {() => (
        // Remove unused renderProps from here
        <>
          <div className={styles.track}>
            <div className={styles.thumb}>
              {icon && <div className={styles.icon}>{icon}</div>}
            </div>
          </div>
          {children}
        </>
      )}
    </AriaSwitch>
  );
};

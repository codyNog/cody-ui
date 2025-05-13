"use client";
import { type ReactElement, forwardRef, useRef } from "react";
import {
  type PressEvent,
  ToggleButton,
  type ToggleButtonProps,
} from "react-aria-components";
import styles from "./index.module.css";

/**
 * Defines the possible variants for the IconButton.
 * - `standard`: A standard icon button.
 * - `filled`: A filled icon button.
 * - `tonal`: A tonal icon button.
 * - `outlined`: An outlined icon button.
 */
type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

/**
 * Props for the IconButton component.
 */
type Props = {
  /** The visual style of the icon button. @default "standard" */
  variant?: IconButtonVariant;
  /**
   * Callback fired when the button is clicked.
   * The first argument is the new selected state of the button.
   * The second argument is the press event.
   */
  onClick?: (newSelectedState: boolean, pressEvent: PressEvent) => void;
  /** The icon element to display within the button. */
  icon: ReactElement;
} & Omit<ToggleButtonProps, "children" | "onPress" | "onClick">;

/**
 * IconButton component.
 * This component is a toggle button that displays an icon.
 */
export const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      icon,
      className,
      variant = "standard",
      isSelected,
      onClick: propsOnClick,
      onChange: propsOnChange,
      ...otherProps
    },
    ref,
  ) => {
    const pressEventRef = useRef<PressEvent | null>(null);

    const handlePress = (e: PressEvent) => {
      pressEventRef.current = e;
    };

    const handleChange = (newlySelected: boolean) => {
      propsOnChange?.(newlySelected);

      if (propsOnClick && pressEventRef.current) {
        propsOnClick(newlySelected, pressEventRef.current);
      }
      pressEventRef.current = null;
    };

    return (
      <ToggleButton
        {...otherProps} // isDisabled など
        ref={ref}
        isSelected={isSelected} // 親から渡された isSelected を使う
        onPress={handlePress} // まず handlePress が呼ばれる
        onChange={handleChange} // 次に handleChange が呼ばれて、ここで propsOnPress を実行
        className={[
          styles.iconButton,
          variant !== "standard" ? styles[variant] : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles.iconContainer}>{icon}</span>
      </ToggleButton>
    );
  },
);

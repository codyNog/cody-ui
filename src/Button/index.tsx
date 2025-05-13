"use client";
import { type ReactNode, forwardRef, useCallback, useRef } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type PressEvent,
} from "react-aria-components";
import { useRipple } from "../Ripple";
import { Typography } from "../Typography";
import styles from "./index.module.css";

type ButtonVariant = "filled" | "outlined" | "text" | "elevated" | "tonal";

type BaseProps = Omit<
  AriaButtonProps,
  "className" | "style" | "children" | "onPress"
>;

/**
 * Props for the Button component.
 */
type Props = BaseProps & {
  /**
   * The visual style of the button.
   * @default 'filled'
   */
  variant?: ButtonVariant;
  /**
   * An icon to display on the left side of the button.
   */
  icon?: ReactNode;
  /**
   * The content to display as the button's label.
   */
  children: ReactNode;
  /**
   * Callback function for when the button is clicked.
   * Receives a PressEvent from react-aria-components.
   */
  onClick?: (e: PressEvent) => void;
};

/**
 * A button component that allows users to trigger an action.
 * It supports different visual styles (variants) and can include an icon.
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 *
 * <Button variant="outlined" icon={<MyIcon />}>
 *   Submit
 * </Button>
 *
 * <Button variant="text" isDisabled>
 *   Disabled
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "filled", icon, children, onClick, ...props }: Props, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { component: Ripple, handleClick: handleRippleClick } = useRipple();

    const handlePress = useCallback(
      (e: PressEvent) => {
        if (props.isDisabled) return;
        onClick?.(e);
      },
      [onClick, props.isDisabled],
    );

    const handlePressStart = useCallback(
      (e: PressEvent) => {
        if (props.isDisabled) return;

        if (buttonRef.current) {
          handleRippleClick(e, buttonRef);
        }
      },
      [props.isDisabled, handleRippleClick],
    );

    return (
      <AriaButton
        {...props}
        onPressStart={handlePressStart}
        ref={(el: HTMLButtonElement | null) => {
          if (typeof ref === "function") {
            ref(el);
            return;
          }
          if (ref) {
            ref.current = el;
          }
          buttonRef.current = el;
        }}
        onPress={onClick ? handlePress : undefined}
        className={({ isPressed, isFocused, isHovered }) => {
          const classNames = [styles.button, styles[variant]];
          if (isPressed) {
            classNames.push(styles.pressed);
          }
          if (isFocused) {
            classNames.push(styles.focused);
          }
          if (isHovered) {
            classNames.push(styles.hovered);
          }
          if (props.isDisabled) {
            classNames.push(styles.disabled);
          }
          return classNames.filter(Boolean).join(" ");
        }}
      >
        {(_renderProps) => (
          <>
            {icon && (
              <span className={`${styles.iconWrapper} ${styles.iconLeading}`}>
                {icon}
              </span>
            )}
            <Typography
              variant="labelLarge"
              color={
                variant === "filled"
                  ? "onPrimary"
                  : variant === "tonal"
                    ? "onSecondaryContainer"
                    : "primary"
              }
            >
              {children}
            </Typography>
            <Ripple />
          </>
        )}
      </AriaButton>
    );
  },
);

Button.displayName = "Button";

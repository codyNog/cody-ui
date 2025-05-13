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

// react-aria-components の ButtonProps から不要なものを除外し、
// 独自のプロパティを追加する
// (className は module css で管理するため除外, children は独自に定義するため除外)
// onPress は onClick に置き換えるため AriaButtonProps からも除外
type BaseProps = Omit<
  AriaButtonProps,
  "className" | "style" | "children" | "onPress"
>;

type Props = BaseProps & {
  /**
   * ボタンのスタイル種別
   * @default 'filled'
   */
  variant?: ButtonVariant;
  /**
   * ボタンの左側に表示するアイコン
   */
  icon?: ReactNode;
  /**
   * ボタンの右側に表示するアイコン
   */
  trailingIcon?: ReactNode;
  /**
   * ボタンのラベルとして表示する内容
   */
  children: ReactNode;
  /**
   * クリック時のコールバック関数
   * react-aria-components の PressEvent を受け取ります
   */
  onClick?: (e: PressEvent) => void;
  // onPress は削除
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "filled",
      icon,
      trailingIcon,
      children,
      onClick,
      ...props
    }: Props,
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { component: Ripple, handleClick: handleRippleClick } = useRipple();

    // onClick が指定されていれば、それを onPress として react-aria-components に渡す
    const handlePress = useCallback(
      (e: PressEvent) => {
        if (props.isDisabled) return; // 無効な場合は何もしない
        onClick?.(e);
      },
      [onClick, props.isDisabled],
    );

    // Rename to handlePressStart and use PressEvent
    const handlePressStart = useCallback(
      (e: PressEvent) => {
        if (props.isDisabled) return;

        if (buttonRef.current) {
          handleRippleClick(e, buttonRef);
        }
        // react-aria-components の PressEvent はデフォルトで伝播を止めるため、
        // stopPropagation は通常不要ですが、意図しない動作を防ぐために明示的に呼ぶことも検討できます。
      },
      [props.isDisabled, handleRippleClick],
    );

    // handleAnimationEnd は不要なので削除

    return (
      <AriaButton
        {...props}
        onPressStart={handlePressStart} // Use onPressStart instead of onPointerDown
        ref={(el: HTMLButtonElement | null) => {
          // Handle both forwardRef and local ref
          if (typeof ref === "function") {
            ref(el);
            return;
          }
          if (ref) {
            ref.current = el;
          }
          buttonRef.current = el; // Assign to local ref as well
        }}
        onPress={onClick ? handlePress : undefined} // onClick があれば handlePress を、なければ undefined を渡す
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
        {/* Render children directly or via render prop */}
        {(_renderProps) => (
          <>
            {/* Render existing content */}
            {icon && <span className={styles.iconWrapper}>{icon}</span>}
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
            {trailingIcon && (
              <span className={styles.iconWrapper}>{trailingIcon}</span>
            )}
            <Ripple />
          </>
        )}
      </AriaButton>
    );
  },
);

// Add display name for better debugging
Button.displayName = "Button";

"use client";
import {
  type ReactNode,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type PressEvent,
} from "react-aria-components";
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

type Ripple = {
  key: number;
  x: number;
  y: number;
  size: number;
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
    const [ripples, setRipples] = useState<Ripple[]>([]); // Initialize state here

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
        // Check if disabled within the handler as onPressStart might fire even if disabled
        if (props.isDisabled) return;

        // Use e.x and e.y directly from PressEvent for coordinates relative to the target
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        // Calculate ripple size based on the button's diagonal
        const size = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;
        // Use coordinates directly from PressEvent
        const x = e.x;
        const y = e.y;

        const newRipple: Ripple = {
          key: Date.now(), // Simple key generation
          x,
          y,
          size,
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);
        // Removed the misplaced closing brace from here
      },
      [props.isDisabled],
    ); // Correctly placed dependency array

    const handleAnimationEnd = useCallback((key: number) => {
      setRipples((prevRipples) =>
        prevRipples.filter((ripple) => ripple.key !== key),
      );
    }, []);

    return (
      <AriaButton
        {...props}
        onPressStart={handlePressStart} // Use onPressStart instead of onPointerDown
        ref={(el: HTMLButtonElement | null) => {
          // Handle both forwardRef and local ref
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
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
            {/* Render ripples */}
            <span className={styles.rippleContainer}>
              {ripples.map((ripple) => (
                <span
                  key={ripple.key}
                  className={styles.ripple}
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                  }}
                  onAnimationEnd={() => handleAnimationEnd(ripple.key)}
                />
              ))}
            </span>
          </>
        )}
      </AriaButton>
    );
  },
);

// Add display name for better debugging
Button.displayName = "Button";

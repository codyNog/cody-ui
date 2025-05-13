"use client";
import { type ReactNode, forwardRef, useRef } from "react"; // MouseEvent のインポートを削除
import { type PressEvent, Button as RACButton } from "react-aria-components";
import { MdCheck } from "../Icons"; // Import MdCheck
import { useRipple } from "../Ripple"; // useRipple, RippleType をインポート
import { Typography } from "../Typography"; // Typography をインポート
import styles from "./index.module.css";

// --- Type Definitions ---

// ベースとなる共通プロパティ
type ChipBaseProps = {
  children: ReactNode;
  leadingIcon?: ReactNode;
  isDisabled?: boolean;
  onClick?: (e: PressEvent) => void; // onPress を onClick に変更
  "aria-label"?: string;
};

// Chip のバリアントを定義
type ChipVariant = "assist" | "filter" | "input" | "suggestion";

// バリアントに応じた固有のプロパティを定義する Conditional Type
type VariantSpecificProps<V extends ChipVariant> =
  // 'filter' の場合は isSelected と trailingIcon を許可
  V extends "filter"
    ? { isSelected?: boolean; trailingIcon?: ReactNode }
    : // 'input' の場合は trailingIcon を許可し、isSelected は禁止
      V extends "input"
      ? { isSelected?: never; trailingIcon?: ReactNode }
      : // 'assist' または 'suggestion' の場合は両方禁止
        { isSelected?: never; trailingIcon?: never };

// ChipProps を Conditional Type を使って定義
// デフォルトのバリアントは 'assist' に設定
type ChipProps<V extends ChipVariant = "assist"> = ChipBaseProps & {
  variant?: V; // variant プロパティを追加
} & VariantSpecificProps<V>; // バリアント固有のプロパティを合成

// --- Component Implementation ---

// forwardRef の型引数を更新
export const Chip = forwardRef<HTMLButtonElement, ChipProps<ChipVariant>>(
  // Use the new ChipProps type
  (props, _ref) => {
    // ref を _ref に変更 (未使用のため)
    // Destructure props based on the specific variant type
    const {
      // デフォルトの variant を 'assist' に設定
      variant = "assist", // Default variant
      children,
      leadingIcon,
      isDisabled = false,
      onClick, // onPress を onClick に変更
      "aria-label": ariaLabel,
    } = props;

    // Type guards are needed for variant-specific props
    // この辺のロジックは Conditional Type でも正しく機能するはず
    const isSelected =
      // variant === "filter" && props.isSelected ? props.isSelected : false;
      variant === "filter" && "isSelected" in props ? props.isSelected : false; // Check if isSelected exists
    // trailingIcon is allowed only for filter and input variants
    const trailingIcon =
      // (variant === "filter" || variant === "input") && props.trailingIcon
      (variant === "filter" || variant === "input") && "trailingIcon" in props
        ? props.trailingIcon
        : undefined; // Check if trailingIcon exists
    // ? props.trailingIcon
    // : undefined;

    // Determine leading icon (checkmark for selected filter chip)
    // Determine leading icon (checkmark for selected filter chip)
    const actualLeadingIcon =
      variant === "filter" && isSelected ? <MdCheck /> : leadingIcon;

    const hasLeadingIcon = actualLeadingIcon != null;
    // trailingIcon is now correctly typed based on variant, check directly
    const hasTrailingIcon = trailingIcon != null;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const { component: Ripple, handleClick } = useRipple(); // setRipples を setRipple に変更

    const onPress = (e: PressEvent) => {
      handleClick(e, buttonRef);
      onClick?.(e);
    };

    return (
      <RACButton
        ref={buttonRef} // ref を buttonRef に変更
        isDisabled={isDisabled}
        onPress={onPress} // onPress を handleClick に変更
        aria-label={ariaLabel}
        className={[
          styles.chip,
          styles[variant], // Apply variant class
          hasLeadingIcon && styles.hasIcon,
          // Only apply hasCloseIcon if trailingIcon is actually present
          hasTrailingIcon && styles.hasCloseIcon,
        ]
          .filter(Boolean)
          .join(" ")}
        // Apply data-selected only if variant is filter and isSelected is true
        data-selected={variant === "filter" && isSelected ? true : undefined}
        data-disabled={isDisabled || undefined}
      >
        {/* Render leading icon with appropriate class and aria-hidden */}
        {hasLeadingIcon && (
          <span
            className={styles.icon}
            // Add aria-hidden only if it's the checkmark icon
            aria-hidden={variant === "filter" && isSelected ? true : undefined}
          >
            {actualLeadingIcon}
          </span>
        )}
        <Typography variant="labelLarge">{children}</Typography>
        {/* Render trailingIcon only if it exists (type system ensures it's not for assist) */}
        {hasTrailingIcon && (
          <span className={styles.closeIcon}>{trailingIcon}</span>
        )}
        <Ripple /> {/* handleAnimationEnd を削除 */}
      </RACButton>
    );
  },
);

Chip.displayName = "Chip";

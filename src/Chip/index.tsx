"use client";
import { type ReactNode, forwardRef } from "react";
import { type PressEvent, Button as RACButton } from "react-aria-components";
import styles from "./index.module.css";

// --- Type Definitions ---

// Base props common to all variants
type ChipBaseProps = {
  children: ReactNode;
  leadingIcon?: ReactNode;
  isDisabled?: boolean;
  onPress?: (e: PressEvent) => void;
  "aria-label"?: string;
};

// Assist Chip: No trailingIcon
type AssistChipProps = ChipBaseProps & {
  variant: "assist";
  trailingIcon?: never; // Explicitly forbid trailingIcon
  isSelected?: never; // Forbid isSelected
};

// Filter Chip: Allows isSelected and trailingIcon
type FilterChipProps = ChipBaseProps & {
  variant: "filter";
  isSelected?: boolean; // isSelected is allowed only for filter
  trailingIcon?: ReactNode; // trailingIcon is allowed
};

// Input Chip: Allows trailingIcon
type InputChipProps = ChipBaseProps & {
  variant: "input";
  trailingIcon?: ReactNode; // trailingIcon is allowed
  isSelected?: never; // Forbid isSelected
};

// Suggestion Chip: Allows trailingIcon
type SuggestionChipProps = ChipBaseProps & {
  variant: "suggestion";
  trailingIcon?: ReactNode; // trailingIcon is allowed
  isSelected?: never; // Forbid isSelected
};

// Union type for all possible Chip props based on variant
type ChipProps =
  | AssistChipProps
  | FilterChipProps
  | InputChipProps
  | SuggestionChipProps;

// --- Component Implementation ---

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  // Use the new ChipProps type
  (props, ref) => {
    // Destructure props based on the specific variant type
    const {
      variant = "assist", // Default variant
      children,
      leadingIcon,
      isDisabled = false,
      onPress,
      "aria-label": ariaLabel,
    } = props;

    // Type guards are needed for variant-specific props
    const isSelected =
      props.variant === "filter" ? (props.isSelected ?? false) : false;
    const trailingIcon =
      props.variant !== "assist" ? props.trailingIcon : undefined;

    // Determine leading icon (checkmark for selected filter chip)
    const actualLeadingIcon =
      variant === "filter" && isSelected ? (
        <span className={styles.icon} aria-hidden="true">
          ✓
        </span>
      ) : (
        leadingIcon
      );

    const hasLeadingIcon = actualLeadingIcon != null;
    // trailingIcon is now correctly typed based on variant, check directly
    const hasTrailingIcon = trailingIcon != null;

    return (
      <RACButton
        ref={ref}
        isDisabled={isDisabled}
        onPress={onPress}
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
        {hasLeadingIcon && (
          <span className={styles.icon}>{actualLeadingIcon}</span>
        )}
        {children}
        {/* Render trailingIcon only if it exists (type system ensures it's not for assist) */}
        {hasTrailingIcon && (
          <span className={styles.closeIcon}>{trailingIcon}</span>
        )}
      </RACButton>
    );
  },
);

Chip.displayName = "Chip";

"use client";
import { type ReactNode, forwardRef, useRef } from "react";
import { type PressEvent, Button as RACButton } from "react-aria-components";
import { MdCheck } from "../Icons";
import { useRipple } from "../Ripple";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Base props common to all chip variants.
 */
type ChipBaseProps = {
  /** The content displayed within the chip, typically text. */
  children: ReactNode;
  /** An optional icon displayed at the beginning of the chip. */
  leadingIcon?: ReactNode;
  /** Whether the chip is disabled. */
  isDisabled?: boolean;
  /** Callback function executed when the chip is pressed. */
  onClick?: (e: PressEvent) => void;
  /** Accessibility label for the chip. */
  "aria-label"?: string;
};

/**
 * Defines the possible visual styles and interaction types for a Chip.
 * - `assist`: Assist chips represent smart or automated actions that can help users.
 * - `filter`: Filter chips represent filters for a collection of content. They can be selected or deselected.
 * - `input`: Input chips represent a complex piece of information, such as an entity (person, place, or thing) or text. They can include a trailing icon for removal.
 * - `suggestion`: Suggestion chips help narrow a user's intent by offering dynamically generated suggestions.
 */
type ChipVariant = "assist" | "filter" | "input" | "suggestion";

/**
 * @internal
 * Conditional type that defines props specific to each `ChipVariant`.
 * - `filter` variant can have `isSelected` and `trailingIcon`.
 * - `input` variant can have `trailingIcon` but not `isSelected`.
 * - `assist` and `suggestion` variants have neither `isSelected` nor `trailingIcon`.
 */
type VariantSpecificProps<V extends ChipVariant> = V extends "filter"
  ? {
      /** Whether the filter chip is currently selected. */
      isSelected?: boolean;
      /** An optional icon displayed at the end of the chip, typically for removal in input chips or custom actions in filter chips. */
      trailingIcon?: ReactNode;
    }
  : V extends "input"
    ? {
        isSelected?: never;
        /** An optional icon displayed at the end of the chip, typically for removal. */
        trailingIcon?: ReactNode;
      }
    : { isSelected?: never; trailingIcon?: never };

/**
 * Props for the Chip component.
 * The props vary based on the selected `variant`.
 * @template V - The variant of the chip, defaults to "assist".
 */
type ChipProps<V extends ChipVariant = "assist"> = ChipBaseProps & {
  /**
   * The visual style and interaction type of the chip.
   * @default 'assist'
   */
  variant?: V;
} & VariantSpecificProps<V>;

/**
 * A Chip component that displays a compact element representing an input, attribute, or action.
 * It supports different variants (`assist`, `filter`, `input`, `suggestion`) with corresponding behaviors and appearances.
 *
 * @example
 * ```tsx
 * // Assist Chip
 * <Chip onClick={() => console.log('Assist chip clicked')}>Assist Me</Chip>
 *
 * // Filter Chip
 * const [selected, setSelected] = useState(false);
 * <Chip
 *   variant="filter"
 *   isSelected={selected}
 *   onClick={() => setSelected(!selected)}
 * >
 *   Filter Option
 * </Chip>
 *
 * // Input Chip with a remove icon
 * <Chip
 *   variant="input"
 *   trailingIcon={<MdClose />}
 *   onClick={() => console.log('Remove input')}
 * >
 *   Search Term
 * </Chip>
 *
 * // Suggestion Chip
 * <Chip variant="suggestion" onClick={() => console.log('Suggestion selected')}>
 *   Suggested Action
 * </Chip>
 * ```
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps<ChipVariant>>(
  (props, _ref) => {
    const {
      variant = "assist",
      children,
      leadingIcon,
      isDisabled = false,
      onClick,
      "aria-label": ariaLabel,
    } = props;

    const isSelected =
      variant === "filter" && "isSelected" in props ? props.isSelected : false;
    const trailingIcon =
      (variant === "filter" || variant === "input") && "trailingIcon" in props
        ? props.trailingIcon
        : undefined;

    const actualLeadingIcon =
      variant === "filter" && isSelected ? <MdCheck /> : leadingIcon;

    const hasLeadingIcon = actualLeadingIcon != null;
    const hasTrailingIcon = trailingIcon != null;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const { component: Ripple, handleClick } = useRipple();

    const onPress = (e: PressEvent) => {
      handleClick(e, buttonRef);
      onClick?.(e);
    };

    return (
      <RACButton
        ref={buttonRef}
        isDisabled={isDisabled}
        onPress={onPress}
        aria-label={ariaLabel}
        className={[
          styles.chip,
          styles[variant],
          hasLeadingIcon && styles.hasIcon,
          hasTrailingIcon && styles.hasCloseIcon,
        ]
          .filter(Boolean)
          .join(" ")}
        data-selected={variant === "filter" && isSelected ? true : undefined}
        data-disabled={isDisabled || undefined}
      >
        {hasLeadingIcon && (
          <span
            className={styles.icon}
            aria-hidden={variant === "filter" && isSelected ? true : undefined}
          >
            {actualLeadingIcon}
          </span>
        )}
        <Typography variant="labelLarge">{children}</Typography>
        {hasTrailingIcon && (
          <span className={styles.closeIcon}>{trailingIcon}</span>
        )}
        <Ripple />
      </RACButton>
    );
  },
);

Chip.displayName = "Chip";

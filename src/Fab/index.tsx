"use client";
import {
  type ComponentProps,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  // useState, // useState は useRipple 内で使われるため、ここでは不要
  useRef, // useRef をインポート
} from "react";
import { useRipple } from "../Ripple"; // useRipple をインポート
import { Typography } from "../Typography"; // Typography をインポート
import styles from "./index.module.css";

type FabVariantValue = "standard" | "extended";
type FabSizeValue = "small" | "medium" | "large";

// Common props shared across all variants
type FabCommonProps = {
  /** The size of the FAB. @default "medium" */
  size?: FabSizeValue;
  /** Aria-label for accessibility. Crucial if the FAB only contains an icon. */
  "aria-label"?: string;
} & Omit<ComponentProps<"button">, "children" | "aria-label">;

// Specific props for the "standard" variant
type StandardFabSpecificProps = {
  variant?: "standard"; // Optional because it's the default
  /** The icon to display in the FAB. Required for standard FAB. */
  icon: ReactNode;
  label?: never; // Label is not allowed for standard FAB
};

// Specific props for the "extended" variant
type ExtendedFabSpecificProps = {
  variant: "extended"; // Required to discriminate
  /** The label for the FAB. Required for extended FAB. */
  label: string;
  /** The icon to display in the FAB. Optional for extended FAB. */
  icon?: ReactNode;
};

// Union type for all possible FAB props, using a generic for the variant
type FabProps<V extends FabVariantValue = "standard"> = FabCommonProps &
  (V extends "standard"
    ? StandardFabSpecificProps
    : V extends "extended"
      ? ExtendedFabSpecificProps
      : never);

export const Fab = forwardRef(
  <V extends FabVariantValue>(
    props: FabProps<V>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const {
      variant = "standard",
      size = "medium",
      className,
      "aria-label": ariaLabelProp,
      // All other props, including variant-specific ones like icon/label, are in restRootProps
      ...restRootProps
    } = props;

    const { handleClick: handleRippleClick, component: RippleVisuals } =
      useRipple();
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Determine the variant, defaulting to 'standard'
    // props.variant can be undefined if V is "standard" (due to `variant?: "standard"`)
    const currentVariant: FabVariantValue = props.variant || "standard";

    let iconNode: ReactNode | undefined;
    let labelText: string | undefined;

    // Safely access variant-specific props based on the determined variant
    if (currentVariant === "standard") {
      // At this point, TypeScript knows props must conform to FabProps<"standard">
      // which includes StandardFabSpecificProps.
      const standardProps = props as FabProps<"standard">;
      iconNode = standardProps.icon;
      // labelText remains undefined as per StandardFabSpecificProps
    } else if (currentVariant === "extended") {
      // props must conform to FabProps<"extended">
      const extendedProps = props as FabProps<"extended">;
      iconNode = extendedProps.icon;
      labelText = extendedProps.label;
    }

    const hasIcon = !!iconNode;
    const isExtendedLayout = currentVariant === "extended";

    const getAccessibleName = () => {
      if (ariaLabelProp) return ariaLabelProp;
      if (isExtendedLayout && labelText) return labelText;
      return undefined;
    };

    const fabClasses = [
      styles.fab,
      isExtendedLayout && styles.extended,
      size === "small" && styles.small,
      size === "large" && styles.large,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Prepare buttonProps by removing props specific to Fab's logic
    // to prevent them from being passed down to the DOM element.
    // The type assertion for restRootProps helps ensure we are considering all possible props
    // that might have come from the union type before stripping them.
    const {
      variant: _variant,
      icon: _icon,
      label: _label,
    } = restRootProps as FabCommonProps &
      StandardFabSpecificProps &
      ExtendedFabSpecificProps;

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          buttonRef.current = node;
        }}
        type="button"
        className={fabClasses}
        aria-label={getAccessibleName()}
        onMouseDown={(e) => {
          handleRippleClick(e, buttonRef);
          props.onMouseDown?.(e);
        }}
        {...restRootProps} // Spread the cleaned buttonProps
      >
        {hasIcon && <span className={styles.icon}>{iconNode}</span>}
        {isExtendedLayout && labelText && (
          <Typography variant="labelLarge" color="onPrimaryContainer">
            {labelText}
          </Typography>
        )}
        <RippleVisuals />
      </button>
    );
  },
);

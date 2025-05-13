"use client";
import {
  type ComponentProps,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useRef,
} from "react";
import { useRipple } from "../Ripple";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Defines the possible variants for the FAB.
 * - `standard`: A standard FAB, typically circular with an icon.
 * - `extended`: An extended FAB, which includes a label and optionally an icon.
 */
type FabVariantValue = "standard" | "extended";

/**
 * Defines the possible sizes for the FAB.
 * - `small`: A small FAB.
 * - `medium`: A medium FAB (default).
 * - `large`: A large FAB.
 */
type FabSizeValue = "small" | "medium" | "large";

/**
 * Common properties shared across all FAB variants.
 */
type FabCommonProps = {
  /** The size of the FAB. @default "medium" */
  size?: FabSizeValue;
  /** Aria-label for accessibility. Crucial if the FAB only contains an icon. */
  "aria-label"?: string;
} & Omit<ComponentProps<"button">, "children" | "aria-label">;

/**
 * Specific properties for the "standard" FAB variant.
 */
type StandardFabSpecificProps = {
  /** The variant of the FAB. */
  variant?: "standard";
  /** The icon to display in the FAB. Required for standard FAB. */
  icon: ReactNode;
  /** Label is not allowed for standard FAB. */
  label?: never;
};

/**
 * Specific properties for the "extended" FAB variant.
 */
type ExtendedFabSpecificProps = {
  /** The variant of the FAB. */
  variant: "extended";
  /** The label for the FAB. Required for extended FAB. */
  label: string;
  /** The icon to display in the FAB. Optional for extended FAB. */
  icon?: ReactNode;
};

/**
 * Props for the Fab component.
 * @template V - The variant of the FAB, defaults to "standard".
 */
type FabProps<V extends FabVariantValue = "standard"> = FabCommonProps &
  (V extends "standard"
    ? StandardFabSpecificProps
    : V extends "extended"
      ? ExtendedFabSpecificProps
      : never);

/**
 * Fab (Floating Action Button) component.
 *
 * @example
 * // Standard FAB
 * <Fab icon={<Icon />} aria-label="Add" />
 *
 * @example
 * // Extended FAB
 * <Fab variant="extended" label="Create" icon={<Icon />} />
 */
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
      ...restRootProps
    } = props;

    const { handleClick: handleRippleClick, component: RippleVisuals } =
      useRipple();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { icon, label }: FabProps<typeof variant> = props;
    const isExtendedLayout = variant === "extended";

    const getAccessibleName = () => {
      if (ariaLabelProp) return ariaLabelProp;
      if (isExtendedLayout && label) return label;
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

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
            return;
          }
          if (ref) {
            ref.current = node;
            return;
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
        {...restRootProps}
      >
        {!!icon && <span className={styles.icon}>{icon}</span>}
        {isExtendedLayout && label && (
          <Typography variant="labelLarge" color="onPrimaryContainer">
            {label}
          </Typography>
        )}
        <RippleVisuals />
      </button>
    );
  },
);

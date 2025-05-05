"use client";
import type { ComponentProps, ReactElement, ReactNode } from "react"; // Import ComponentProps
import type { TooltipProps as AriaTooltipProps } from "react-aria-components";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from "react-aria-components";
import styles from "./index.module.css";
import { Button } from "../Button"; // Keep Button import

// --- Types ---

/**
 * Represents an action button within the Tooltip.
 * Uses ComponentProps to derive necessary props from Button, ensuring type safety.
 */
type TooltipAction = {
  /** The text label for the action button. */
  label: ReactNode;
  /** Function called when the button is pressed. */
  onPress?: ComponentProps<typeof Button>["onPress"];
  /** Whether the button is disabled. */
  isDisabled?: ComponentProps<typeof Button>["isDisabled"];
};

// --- Tooltip Component ---

// Define props for the new Tooltip API explicitly
type TooltipProps = {
  // --- Custom Props ---
  /**
   * The content to display inside the tooltip popup.
   */
  content: ReactNode;
  /**
   * The element that triggers the tooltip.
   */
  children: ReactElement; // Use imported ReactElement, expect a single element trigger
  /**
   * The visual style of the tooltip.
   * - `plain`: A simple text-only tooltip.
   * - `rich`: A tooltip with more content and structure.
   * @default plain
   */
  variant?: "plain" | "rich";
  /**
   * Optional action buttons to display in the rich tooltip.
   * Only applicable when variant is 'rich'.
   * Expects an array of objects defining button properties.
   */
  actions?: TooltipAction[];
  /**
   * Delay in milliseconds before the tooltip appears.
   * @default 0
   */
  delay?: number;
  /**
   * Delay in milliseconds before the tooltip disappears after hover/focus loss.
   * @default 500
   */
  closeDelay?: number;
  /**
   * Disables the tooltip trigger.
   * @default false
   */
  isDisabled?: boolean;

  // --- Props inherited/forwarded from AriaTooltipProps ---
  /**
   * The placement of the tooltip relative to its trigger.
   * @default 'top'
   */
  placement?: AriaTooltipProps["placement"];
  /**
   * The distance between the tooltip and its trigger.
   * Value is calculated based on variant if not provided.
   */
  offset?: number; // AriaTooltipProps["offset"] is number | undefined
  /**
   * The distance along the trigger element to offset the tooltip.
   */
  crossOffset?: number; // AriaTooltipProps["crossOffset"] is number | undefined
  /**
   * Whether the tooltip should flip its placement when it overflows the viewport.
   * @default true
   */
  shouldFlip?: boolean; // AriaTooltipProps["shouldFlip"] is boolean | undefined
  /**
   * The padding between the tooltip and the edge of the viewport.
   * @default 12
   */
  containerPadding?: number; // AriaTooltipProps["containerPadding"] is number | undefined
  /**
   * Whether the tooltip is currently open.
   * Useful for controlling the tooltip state programmatically.
   */
  isOpen?: boolean; // AriaTooltipProps["isOpen"] is boolean | undefined
  /**
   * Handler that is called when the tooltip's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void; // AriaTooltipProps["onOpenChange"]
};

/**
 * Tooltip displays contextual information on hover or focus for a trigger element.
 */
export const Tooltip = ({
  content,
  children, // This is the trigger element
  variant = "plain",
  actions,
  delay = 0,
  closeDelay = 500, // Set default close delay here
  isDisabled = false,
  // Explicitly destructure forwarded AriaTooltipProps
  placement,
  offset,
  crossOffset,
  shouldFlip,
  containerPadding,
  isOpen,
  onOpenChange,
}: TooltipProps) => {
  // Determine offset based on variant if not explicitly provided
  const calculatedOffset = offset ?? (variant === "rich" ? 16 : 8); // Keep this logic

  return (
    <AriaTooltipTrigger
      delay={delay}
      closeDelay={closeDelay} // Pass closeDelay directly
      isDisabled={isDisabled}
    >
      {/* Pass the trigger element directly */}
      {children}
      {/* Define the tooltip popup */}
      <AriaTooltip
        // Pass explicitly defined props to AriaTooltip
        placement={placement}
        offset={calculatedOffset} // Use calculated or provided offset
        crossOffset={crossOffset}
        shouldFlip={shouldFlip}
        containerPadding={containerPadding}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={`${styles.tooltip} ${styles[variant]}`} // entering/exitingクラスの参照を削除
      >
        {/* Render content directly */}
        {content}
        {/* Conditionally render actions for rich variant */}
        {/* Conditionally render actions for rich variant */}
        {variant === "rich" && actions && actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: label is ReactNode, cannot guarantee stable string key
              <Button key={index} variant="text" {...action}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
};

// No longer exporting the internal trigger wrapper

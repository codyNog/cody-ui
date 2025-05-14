"use client";
import { type ReactNode, forwardRef, type ForwardedRef } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Defines an action that can be performed within a rich tooltip.
 */
type Action = {
  /** The text label for the action button. */
  label: string;
  /** Function called when the button is clicked. */
  onClick?: () => void;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
};

/**
 * Base props common to all tooltip variants.
 */
type BaseTooltipProps = {
  /** The trigger element for the tooltip. */
  children?: ReactNode;
  /** Controls the open state of the tooltip. */
  isOpen?: boolean;
  /** Handler that is called when the tooltip's open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * Props for the Tooltip component, supporting both plain and rich variants
 * through a generic type parameter `V`.
 */
type TooltipProps<V extends "plain" | "rich" = "plain"> = BaseTooltipProps &
  (V extends "rich"
    ? {
        /** The variant of the tooltip. For rich tooltips, this is "rich". */
        variant: "rich";
        /** The title of the rich tooltip. */
        title?: string;
        /** An array of actions to display in the rich tooltip. */
        actions?: Action[];
        /** The content to display in the rich tooltip. Can be complex React nodes. */
        content: ReactNode;
      }
    : {
        /** The variant of the tooltip. For plain tooltips, this is "plain". */
        variant?: "plain";
        /** Actions are not applicable to plain tooltips. */
        actions?: never;
        /** The text content to display in the tooltip. */
        content: string;
        /** Title is not applicable to plain tooltips. */
        title?: never;
      });

/**
 * Tooltip component displays information related to an element when the user
 * hovers over or focuses on it. Supports plain text and rich content with actions.
 * Built using `react-aria-components`.
 */
export const Tooltip = forwardRef(function Tooltip<
  V extends "plain" | "rich" = "plain",
>(
  {
    children,
    isOpen,
    onOpenChange,
    variant = "plain",
    title,
    actions,
    content,
  }: TooltipProps<V>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isRich = variant === "rich";

  const tooltipPopupClasses = [
    styles.tooltipPopupBase,
    isRich ? styles.tooltipPopupRich : styles.tooltipPopupPlain,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TooltipTrigger delay={100} isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
      <AriaTooltip ref={ref} className={tooltipPopupClasses}>
        {!isRich && (
          <Typography variant="bodySmall" color="inverseOnSurface">
            {content}
          </Typography>
        )}
        {isRich && (
          <>
            {title && (
              <Typography variant="bodyMedium" color="onSurface">
                {title}
              </Typography>
            )}
            {/* content は variant によらず表示するが、型は V によって異なる */}
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {typeof content === "string" ? content : content}
            </Typography>
            {actions && actions.length > 0 && (
              <div className={styles.actions}>
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      action.onClick?.();
                    }}
                    disabled={action.isDisabled}
                    className={styles.tooltipAction}
                  >
                    <Typography variant="labelLarge" color="primary">
                      {action.label}
                    </Typography>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </AriaTooltip>
    </TooltipTrigger>
  );
});

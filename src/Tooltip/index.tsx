"use client";
import { type ReactNode, forwardRef } from "react";
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
};

/**
 * Props for a plain tooltip, which displays simple text content.
 */
type PlainProps = BaseTooltipProps & {
  /** The variant of the tooltip. For plain tooltips, this is "plain". */
  variant?: "plain";
  /** Actions are not applicable to plain tooltips. */
  actions?: never;
  /** The text content to display in the tooltip. */
  content: string;
};

/**
 * Props for a rich tooltip, which can display a title, complex content, and actions.
 */
type RichProps = BaseTooltipProps & {
  /** The variant of the tooltip. For rich tooltips, this is "rich". */
  variant: "rich";
  /** The title of the rich tooltip. */
  title: string;
  /** An array of actions to display in the rich tooltip. */
  actions: Action[];
  /** The content to display in the rich tooltip. Can be complex React nodes. */
  content: ReactNode;
};

/**
 * Props for the Tooltip component, supporting both plain and rich variants.
 */
type Props = PlainProps | RichProps;

/**
 * Tooltip component displays information related to an element when the user
 * hovers over or focuses on it. Supports plain text and rich content with actions.
 * Built using `react-aria-components`.
 */
export const Tooltip = forwardRef<HTMLDivElement, Props>(
  ({ children, content, ...props }, ref) => {
    const isRich = props.variant === "rich";
    const title = isRich ? (props as RichProps).title : undefined;
    const actions = isRich ? (props as RichProps).actions : undefined;

    const tooltipPopupClasses = [
      styles.tooltipPopupBase,
      isRich ? styles.tooltipPopupRich : styles.tooltipPopupPlain,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <TooltipTrigger delay={100}>
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
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {content}
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
  },
);

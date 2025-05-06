"use client";
import { forwardRef, type ReactNode } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components";
import styles from "./index.module.css";

type Action = {
  /** The text label for the action button. */
  label: string;
  /** Function called when the button is pressed. */
  onPress?: () => void;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
};

type BaseProps = {
  children?: ReactNode;
  content: string;
};

type PlainTooltipProps = BaseProps & {
  variant?: "plain";
  actions?: never;
};

type RichTooltipProps = BaseProps & {
  variant: "rich";
  title: string;
  actions: Action[];
};

type Props = PlainTooltipProps | RichTooltipProps;

export const Tooltip = forwardRef<HTMLDivElement, Props>(
  ({ children, content, ...props }, ref) => {
    const isRich = props.variant === "rich";
    // Safely access title and actions only if props is RichTooltipProps
    const title = isRich ? (props as RichTooltipProps).title : undefined;
    const actions = isRich ? (props as RichTooltipProps).actions : undefined;

    const tooltipPopupClasses = [
      styles.tooltipPopupBase,
      isRich ? styles.tooltipPopupRich : styles.tooltipPopupPlain,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <TooltipTrigger delay={0}>
        {children}
        <AriaTooltip ref={ref} className={tooltipPopupClasses}>
          {isRich && title && <span className={styles.richTitle}>{title}</span>}
          <span className={styles.tooltipContent}>{content}</span>
          {isRich && actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    action.onPress?.();
                  }}
                  disabled={action.isDisabled}
                  className={styles.tooltipAction}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </AriaTooltip>
      </TooltipTrigger>
    );
  },
);

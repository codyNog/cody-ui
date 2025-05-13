"use client";
import { type ReactNode, forwardRef } from "react";
import { Drawer } from "vaul";
import { Button } from "../Button";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Props for the SideSheet component.
 */
type Props = {
  /** The visual variant of the side sheet. @default "standard" */
  variant?: "standard" | "modal";
  /** The trigger element that opens the side sheet. Typically a Button. */
  children?: ReactNode;
  /** The headline or title of the side sheet. */
  headline: string;
  /** The main content to be displayed within the side sheet. */
  content: ReactNode;
  /** Controls the open state of the side sheet. */
  isOpen?: boolean;
  /** Callback function invoked when the open state of the side sheet changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** An array of action buttons to display in the footer of the side sheet. */
  actions?: {
    /** The label text for the action button. */
    label: string;
    /** The visual variant of the action button. */
    variant?: "filled" | "outlined";
    /** Callback function invoked when the action button is clicked. */
    onClick: () => void;
  }[];
};

/**
 * SideSheet component provides a panel that slides in from the side of the screen.
 * It can be used for displaying supplementary content or actions.
 * Based on the `vaul` library for drawer functionality.
 */
export const SideSheet = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      headline,
      content,
      isOpen,
      onOpenChange,
      actions,
      variant = "standard",
    },
    ref,
  ) => {
    return (
      <Drawer.Root
        shouldScaleBackground
        open={isOpen}
        onOpenChange={onOpenChange}
        modal={variant === "modal"}
        direction="right"
      >
        {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
        <Drawer.Portal>
          <Drawer.Overlay className={styles.overlay} />
          <Drawer.Content className={styles.content} ref={ref}>
            <div className={styles.header}>
              <Drawer.Title>
                <Typography variant="headlineSmall" color="onSurface">
                  {headline}
                </Typography>
              </Drawer.Title>
            </div>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {content}
            </Typography>
            {actions && actions.length > 0 && (
              <div className={styles.footer}>
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  },
);

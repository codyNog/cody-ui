"use client";
import { type ReactNode, forwardRef } from "react";
import { Drawer } from "vaul";
import { Button } from "../Button";
import { Typography } from "../Typography";
import styles from "./index.module.css";

type Props = {
  variant?: "standard" | "modal"; // TODO: variantの対応
  children?: ReactNode; // Drawer.Triggerになる想定
  headline: string;
  content: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  actions?: {
    label: string;
    variant?: "filled" | "outlined";
    onClick: () => void;
  }[];
};

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
        direction="right" // 右から出てくるように設定！
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

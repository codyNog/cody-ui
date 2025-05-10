"use client";
import { Typography } from "../Typography";
import { type ReactNode, forwardRef } from "react";
import { Drawer } from "vaul";
import styles from "./index.module.css";

type Props = {
  children?: ReactNode; // Drawer.Triggerになる想定
  headline?: string; // 省略可能にする（ハンドルのみの場合など）
  content: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  showHandle?: boolean; // ハンドルを表示するかどうか
  variant?: "standard" | "modal";
};

export const BottomSheet = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      headline,
      content,
      isOpen,
      onOpenChange,
      showHandle = true, // デフォルトでハンドル表示
      variant = "standard",
    },
    ref,
  ) => {
    return (
      <Drawer.Root
        shouldScaleBackground
        open={isOpen}
        onOpenChange={onOpenChange}
        // direction="bottom" は vaul のデフォルトなので指定不要
        modal={variant === "modal"}
      >
        {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
        <Drawer.Portal>
          <Drawer.Overlay className={styles.overlay} />
          <Drawer.Content className={styles.content} ref={ref}>
            {showHandle && <div className={styles.handle} />}
            {headline && (
              <div className={styles.header}>
                <Drawer.Title>
                  <Typography variant="headlineSmall" color="onSurface">
                    {headline}
                  </Typography>
                </Drawer.Title>
              </div>
            )}
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {content}
            </Typography>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  },
);

"use client";
import { type ReactNode, forwardRef } from "react";
import { Drawer } from "vaul";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Props for the BottomSheet component.
 */
type Props = {
  /**
   * The trigger element for the bottom sheet.
   * If not provided, the bottom sheet must be controlled externally via `isOpen` and `onOpenChange`.
   */
  children?: ReactNode;
  /**
   * An optional headline for the bottom sheet.
   */
  headline?: string;
  /**
   * The main content of the bottom sheet.
   */
  content: ReactNode;
  /**
   * Controls the open state of the bottom sheet.
   */
  isOpen?: boolean;
  /**
   * Callback fired when the open state of the bottom sheet changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether to show the drag handle at the top of the bottom sheet.
   * @default true
   */
  showHandle?: boolean;
  /**
   * The variant of the bottom sheet.
   * - `standard`: A standard bottom sheet that does not block interaction with the rest of the page.
   * - `modal`: A modal bottom sheet that blocks interaction with the rest of the page.
   * @default 'standard'
   */
  variant?: "standard" | "modal";
};

/**
 * A BottomSheet component that slides up from the bottom of the screen,
 * typically used to display supplementary content or actions.
 * It utilizes the `vaul` library.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <BottomSheet
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   headline="Options"
 *   content={<p>This is the content of the bottom sheet.</p>}
 * >
 *   <button>Open Bottom Sheet</button>
 * </BottomSheet>
 *
 * <BottomSheet
 *   variant="modal"
 *   content={<p>This is a modal bottom sheet.</p>}
 * >
 *  <button>Open Modal Bottom Sheet</button>
 * </BottomSheet>
 * ```
 */
export const BottomSheet = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      headline,
      content,
      isOpen,
      onOpenChange,
      showHandle = true,
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

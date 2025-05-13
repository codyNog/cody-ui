"use client";
import {
  type DialogProps as AriaDialogElementProps,
  DialogTrigger as AriaDialogTrigger,
} from "react-aria-components";
import { BasicDialog } from "./Basic";
import { FullScreenDialog } from "./FullScreen";
import type { DialogProps, FullScreenDialogProps } from "./types";

/**
 * A Dialog component that provides a way to present information or actions to the user
 * in a modal or non-modal window. It supports "basic" and "full-screen" variants.
 *
 * The `children` prop is used as the trigger element for the dialog.
 *
 * @param {DialogProps} props - The props for the Dialog component.
 * @returns {JSX.Element} The rendered DialogTrigger with the appropriate dialog content.
 *
 * @example
 * ```tsx
 * // Basic Dialog
 * <Dialog
 *   variant="basic"
 *   headline="Basic Dialog Title"
 *   supportingText="This is the supporting text for the basic dialog."
 *   actions={[{ label: "OK", onClick: () => console.log("OK clicked") }]}
 * >
 *   <button>Open Basic Dialog</button>
 * </Dialog>
 *
 * // Full-Screen Dialog
 * <Dialog
 *   variant="full-screen"
 *   headline="Full-Screen Dialog Title"
 *   dialogContent={<p>This is the content for the full-screen dialog.</p>}
 *   onDismiss={() => console.log("Dismissed")}
 * >
 *   <button>Open Full-Screen Dialog</button>
 * </Dialog>
 * ```
 */
export const Dialog = (props: DialogProps) => {
  const {
    children,
    isOpen,
    onOpenChange,
    defaultOpen,
    variant = "basic",
    ...restProps
  } = props;

  return (
    <AriaDialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {children}
      {variant === "basic" &&
        (() => {
          const {
            icon,
            headline,
            supportingText,
            actions,
            ...remainingRestProps
          } = restProps as Extract<DialogProps, { variant?: "basic" }>;
          return (
            <BasicDialog
              icon={icon}
              headline={headline}
              supportingText={supportingText}
              actions={actions}
              {...(remainingRestProps as AriaDialogElementProps)}
            />
          );
        })()}
      {variant === "full-screen" &&
        (() => {
          const {
            headline,
            onDismiss,
            headerActions,
            dialogContent,
            ...remainingRestProps
          } = restProps as Extract<DialogProps, { variant: "full-screen" }>;
          return (
            <FullScreenDialog
              headline={headline}
              onDismiss={onDismiss}
              headerActions={headerActions}
              {...(remainingRestProps as Omit<
                FullScreenDialogProps,
                // Props handled by DialogTrigger or specific to DialogProps wrapper
                | "children"
                | "isOpen"
                | "onOpenChange"
                | "defaultOpen"
                | "headline"
                | "onDismiss"
                | "headerActions"
              >)}
            >
              {dialogContent}
            </FullScreenDialog>
          );
        })()}
    </AriaDialogTrigger>
  );
};

"use client";
import {
  type DialogProps as AriaDialogElementProps, // Renamed to avoid conflict
  DialogTrigger as AriaDialogTrigger,
} from "react-aria-components";
import { BasicDialog } from "./Basic";
import { FullScreenDialog } from "./FullScreen";
import type { DialogProps, FullScreenDialogProps } from "./types";

export const Dialog = (props: DialogProps) => {
  const {
    children, // This is the trigger
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
      {children} {/* Trigger element */}
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
              // Pass only the remaining FullScreenDialogTypeProps, excluding ones already handled or part of trigger
              {...(remainingRestProps as Omit<
                FullScreenDialogProps,
                | "children" // This is for the main content, passed as children to FullScreenDialog
                | "isOpen"
                | "onOpenChange"
                | "defaultOpen"
                | "headline"
                | "onDismiss"
                | "headerActions"
                // 'dialogContent' is not a prop of FullScreenDialog itself, it's destructured above
              >)}
            >
              {dialogContent}
            </FullScreenDialog>
          );
        })()}
    </AriaDialogTrigger>
  );
};

import type { ReactNode } from "react";
import type {
  DialogProps as AriaDialogProps,
  DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components";

export type BasicDialogProps = Omit<AriaDialogProps, "children"> & {
  icon?: ReactNode;
  headline: string;
  supportingText?: ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
};

export type FullScreenDialogProps = Omit<AriaDialogProps, "children"> & {
  children: ReactNode; // Dialogのメインコンテンツ
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  headline: string;
  // full-screen dialog特有のPropsを追加していく
  // 例: headerActions, onDismissなど
  onDismiss?: () => void; // 閉じるボタンのアクション
  headerActions?: {
    label: string;
    onClick: () => Promise<void>; // voidを返すPromiseに変更
  }[];
};

// --- Combined Dialog Props ---
type BaseDialogTriggerProps = Pick<
  AriaDialogTriggerProps,
  "isOpen" | "onOpenChange" | "defaultOpen"
>;

// Props for the trigger element itself
type DialogTriggerElementProps = {
  children: ReactNode; // This is the trigger element
};

type DialogVariantProps =
  | ({
      variant?: "basic";
    } & Omit<BasicDialogProps, keyof AriaDialogProps | "children"> & // Pass through specific BasicDialog props
      AriaDialogProps) // Allow AriaDialog props for basic
  | ({
      variant: "full-screen";
      // Pass through FullScreenDialog props, excluding those managed by DialogTrigger
    } & Omit<
      FullScreenDialogProps,
      keyof BaseDialogTriggerProps | "children" // Exclude trigger props and main content children
    > & { dialogContent: ReactNode }); // Explicit prop for full-screen content

export type DialogProps = BaseDialogTriggerProps &
  DialogTriggerElementProps &
  DialogVariantProps;

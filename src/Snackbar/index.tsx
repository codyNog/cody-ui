"use client";
import { type ReactNode, createContext, useContext } from "react";
import {
  Button,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  type UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";
import styles from "./index.module.css";

/**
 * Defines the content structure for a Snackbar message.
 */
export type SnackbarContent = {
  /** The main text content of the Snackbar. */
  supportingText?: string;
  /** Optional action button configuration. */
  action?: {
    /** The label for the action button. */
    label: string;
    /** Callback function invoked when the action button is clicked. */
    onClick: () => void;
  };
  /** Whether the Snackbar can be closed by the user. @default true */
  closeable?: boolean;
};

const SnackbarContext = createContext<ToastQueue<SnackbarContent> | null>(null);

/**
 * Props for the SnackbarProvider component.
 */
type ProviderProps = {
  /** The child elements to be rendered within the provider. */
  children: ReactNode;
  /** The toast queue instance to manage Snackbar messages. */
  queue: ToastQueue<SnackbarContent>;
};

/**
 * SnackbarProvider component sets up the context for displaying Snackbar messages.
 * It uses `react-aria-components` ToastRegion to manage the queue and rendering of Snackbars.
 */
export const SnackbarProvider = ({ children, queue }: ProviderProps) => {
  return (
    <SnackbarContext.Provider value={queue}>
      <ToastRegion queue={queue} className={styles.toastRegion}>
        {({ toast }) => {
          const { content } = toast;
          const { supportingText, action, closeable } = content;

          return (
            <Toast toast={toast} className={styles.toast}>
              <ToastContent className={styles.toastContent}>
                {supportingText && (
                  <Text slot="description" className={styles.description}>
                    {supportingText}
                  </Text>
                )}
              </ToastContent>
              <div className={styles.actions}>
                {action && (
                  <Button
                    onClick={action.onClick}
                    className={styles.actionButton}
                  >
                    {action.label}
                  </Button>
                )}
                {closeable && (
                  <Button slot="close" className={styles.closeButton}>
                    ✕
                  </Button>
                )}
              </div>
            </Toast>
          );
        }}
      </ToastRegion>
      {children}
    </SnackbarContext.Provider>
  );
};

/**
 * Custom hook to access the Snackbar queue for adding new messages.
 * This hook must be used within a `SnackbarProvider`.
 *
 * @returns An object with an `add` function to display new Snackbar messages.
 * @throws Error if used outside of a `SnackbarProvider`.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { add: addSnackbar } = useSnackbar();
 *
 *   const showMessage = () => {
 *     addSnackbar(
 *       { supportingText: "This is a snackbar message!" },
 *       { timeout: 5000 }
 *     );
 *   };
 *
 *   return <button onClick={showMessage}>Show Snackbar</button>;
 * };
 * ```
 */
export const useSnackbar = () => {
  const queue = useContext(SnackbarContext);
  if (!queue) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return {
    add: (
      content: SnackbarContent,
      options?: {
        priority?: number;
        timeout?: number;
        onDismiss?: () => void;
      },
    ) => queue.add(content, options),
  };
};

"use client";
import { type ReactNode, createContext, useContext } from "react"; // ReactNodeをインポート
import {
  Button,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  type UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";
import styles from "./index.module.css";

// Define the type for your toast content.
// Propsを拡張してSnackbarのコンテンツとする
export type SnackbarContent = {
  supportingText?: string;
  action?: {
    label: string;
    onClick: () => void; // onPress を onClick に変更
  };
  closeable?: boolean; // デフォルトはtrue
};

const SnackbarContext = createContext<ToastQueue<SnackbarContent> | null>(null);

type SnackbarProviderProps = {
  children: ReactNode;
  queue: ToastQueue<SnackbarContent>;
};

export const SnackbarProvider = ({
  children,
  queue,
}: SnackbarProviderProps) => {
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
                    onClick={action.onClick} // onPress を onClick に変更
                    className={styles.actionButton}
                  >
                    {action.label}
                  </Button>
                )}
                {closeable && (
                  <Button slot="close" className={styles.closeButton}>
                    {/* アイコンやテキストなど、閉じるボタンの見た目をここに定義 */}
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

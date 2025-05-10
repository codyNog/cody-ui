"use client";

import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Typography } from "../Typography"; // Typography をインポート
import { MdClose } from "react-icons/md"; // 閉じるボタン用にアイコンを直接インポート
import { Button } from "../Button";
import styles from "./index.module.css"; // 基本のスタイルを共有しつつ、必要なら専用スタイルも作る
import type { FullScreenDialogProps } from "./types";

export const FullScreenDialog = ({
  children,
  isOpen,
  onOpenChange,
  defaultOpen,
  headline,
  onDismiss,
  headerActions,
  ...ariaDialogElementProps
}: FullScreenDialogProps) => {
  // full-screen用のスタイルを適用
  const dialogClasses = [
    styles.dialog,
    styles.dialogFullScreen, // 専用スタイルクラス
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ModalOverlay
      className={styles.modalOverlayFullScreen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
    >
      <Modal className={styles.modalFullScreen}>
        <AriaDialog {...ariaDialogElementProps} className={dialogClasses}>
          <header className={styles.fullScreenHeader}>
            <Button
              variant="text"
              onPress={onDismiss}
              aria-label="Close dialog"
            >
              <MdClose />
            </Button>
            <Heading slot="title">
              <Typography variant="titleLarge" color="onSurface">
                {headline}
              </Typography>
            </Heading>
            <div className={styles.fullScreenHeaderActions}>
              {headerActions?.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  onPress={action.onPress}
                  variant="text" // M3のText Buttonを想定
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </header>
          <div className={styles.fullScreenContent}>{children}</div>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
};

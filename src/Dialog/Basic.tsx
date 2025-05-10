"use client";

import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Button } from "../Button";
import { Typography } from "../Typography"; // Typography をインポート
import styles from "./index.module.css";
import type { BasicDialogProps } from "./types";

export const BasicDialog = ({
  icon,
  headline,
  supportingText,
  actions,
  ...ariaDialogElementProps
}: BasicDialogProps) => {
  return (
    <ModalOverlay className={styles.modalOverlay} isDismissable>
      <Modal className={styles.modal}>
        <AriaDialog {...ariaDialogElementProps} className={styles.dialog}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <Heading slot="title">
            <Typography variant="headlineSmall" color="onSurface">
              {headline}
            </Typography>
          </Heading>
          {supportingText && (
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {supportingText}
            </Typography>
          )}
          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  variant="text"
                  onClick={action.onClick}
                  slot={"close"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
};

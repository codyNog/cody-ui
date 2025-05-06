"use client";

import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Button } from "../Button";
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
          <Heading slot="title" className={styles.headline}>
            {headline}
          </Heading>
          {supportingText && (
            <div className={styles.supportingText}>{supportingText}</div>
          )}
          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  onPress={action.onPress}
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

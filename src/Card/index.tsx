"use client";
import { forwardRef, type HTMLAttributes } from "react";
import styles from "./index.module.css";
import { Button } from "../Button"; // Assuming Button component exists

type Props = {
  headline?: string;
  subhead?: string;
  supportingText?: string;
  /** @deprecated Use `media.image` instead */
  image?: string;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary"; // Add variant for button
  }>;
  media?: {
    image?: string;
    alt?: string;
  };
  variant?: "elevated" | "outlined" | "filled";
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, Props>(
  (
    {
      headline,
      subhead,
      supportingText,
      image, // Keep for backward compatibility, but prefer media.image
      actions,
      media,
      variant = "elevated", // Default to elevated
      className,
      children, // Allow children for more flexibility
      ...rest
    },
    ref,
  ) => {
    const mediaContent =
      media?.image || image ? (
        <img
          src={media?.image || image}
          alt={media?.alt || headline || ""}
          className={styles.media}
        />
      ) : null;

    return (
      <div
        ref={ref}
        className={`${styles.base} ${styles[variant]} ${className || ""}`}
        {...rest}
      >
        {mediaContent && (
          <div className={styles.mediaContainer}>{mediaContent}</div>
        )}
        {(headline || subhead) && (
          <div className={styles.header}>
            {headline && <h2 className={styles.headline}>{headline}</h2>}
            {subhead && <p className={styles.subhead}>{subhead}</p>}
          </div>
        )}
        {supportingText && (
          <div className={styles.supportingText}>{supportingText}</div>
        )}
        {children}
        {actions && actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={`${action.label}-${index}`} // Use a more unique key
                variant={action.variant === "primary" ? "filled" : "outlined"} // Map to Button's variants
                onClick={action.onPress}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

"use client";
import { type HTMLAttributes, type ReactNode, forwardRef, useRef } from "react";
import { Button } from "../Button";
import { useRipple } from "../Ripple";
import styles from "./index.module.css";

/**
 * Props for the Card component.
 */
type Props = {
  /**
   * The main headline or title of the card.
   */
  headline?: string;
  /**
   * A sub-headline or secondary title for the card.
   */
  subhead?: string;
  /**
   * Supporting text or description content for the card.
   */
  supportingText?: string;
  /**
   * The URL of an image to display in the card.
   * @deprecated Use `media.image` instead for better structure and alt text support.
   */
  image?: string;
  /**
   * An array of action objects to render as buttons at the bottom of the card.
   */
  actions?: Array<{
    /** The text label for the action button. */
    label: string;
    /** Callback function executed when the action button is clicked. */
    onClick: () => void;
    /**
     * The visual style of the action button.
     * 'primary' will render a filled button.
     * 'secondary' will render an outlined button.
     */
    variant?: "primary" | "secondary";
  }>;
  /**
   * Media content to display at the top of the card.
   */
  media?: {
    /** The URL of the image for the media content. */
    image?: string;
    /** Alt text for the media image, for accessibility. Defaults to `headline` if not provided. */
    alt?: string;
  };
  /**
   * The visual style (variant) of the card.
   * @default 'elevated'
   */
  variant?: "elevated" | "outlined" | "filled";
  /**
   * Allows passing custom child elements for more flexible card content.
   * These children will be rendered below the supporting text and before the actions.
   */
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * A Card component that displays content and actions about a single subject.
 * Cards can include a headline, subhead, supporting text, media (image), and actions.
 * They support 'elevated', 'outlined', and 'filled' visual styles.
 *
 * @example
 * ```tsx
 * <Card
 *   headline="Card Title"
 *   subhead="Subtitle here"
 *   supportingText="This is some supporting text for the card."
 *   media={{ image: "https://via.placeholder.com/300x200", alt: "Placeholder image" }}
 *   actions={[
 *     { label: "Action 1", onClick: () => console.log("Action 1 clicked") },
 *     { label: "Action 2", onClick: () => console.log("Action 2 clicked"), variant: "primary" },
 *   ]}
 * />
 *
 * <Card variant="outlined" headline="Outlined Card">
 *   <p>Custom content can go here.</p>
 * </Card>
 * ```
 */
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
    const { component: Ripple, handleClick } = useRipple();
    const cardRef = useRef<HTMLDivElement>(null);

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
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          cardRef.current = node;
        }}
        className={`${styles.base} ${styles[variant]} ${className || ""}`}
        onClick={(e) => {
          handleClick(e, cardRef);
          rest.onClick?.(e); // Call original onClick if it exists
        }}
        {...rest}
      >
        <Ripple />
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
                onClick={action.onClick} // action.onPress を action.onClick に変更
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

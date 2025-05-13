"use client";
import { type ReactNode, forwardRef } from "react";
import {
  Button,
  Input,
  SearchField,
  type SearchFieldProps,
} from "react-aria-components";
import { MdClose as CloseIcon, MdSearch as SearchIcon } from "../Icons";
import styles from "./index.module.css";

/**
 * Props for the Search component.
 */
type Props = SearchFieldProps & {
  /** Callback fired when the leading icon button is clicked. */
  onClickLeadingIcon?: () => void;
  /** Placeholder text for the input field. */
  supportingText?: string;
  /** Optional element to display on the right side of the input (e.g., an icon or avatar). */
  trailingElement?: ReactNode;
  /** Optional icon to display on the left side of the input. Defaults to a search icon. */
  leadingIcon?: ReactNode;
  /**
   * The ARIA label for the search field.
   * It's crucial to provide a descriptive label for accessibility, especially when a visible label is not present.
   */
  "aria-label": string;
};

/**
 * Search component
 *
 * Provides a search input field with optional leading and trailing elements.
 * It's important to provide an `aria-label` for accessibility.
 * @see https://m3.material.io/components/search/overview
 */
export const Search = forwardRef<HTMLDivElement, Props>(
  (
    {
      onClickLeadingIcon,
      supportingText,
      trailingElement,
      leadingIcon,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <SearchField
        ref={ref}
        {...props}
        aria-label={ariaLabel}
        className={styles.search}
      >
        <div className={styles.inputWrapper}>
          <Button onClick={onClickLeadingIcon} className={styles.leadingIcon}>
            {leadingIcon || <SearchIcon />}
          </Button>
          <Input className={styles.input} placeholder={supportingText} />
          {trailingElement}
          {!trailingElement && props.value && (
            <Button className={styles.clearButton}>
              <CloseIcon />
            </Button>
          )}
        </div>
      </SearchField>
    );
  },
);

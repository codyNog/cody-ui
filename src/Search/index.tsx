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

type Props = SearchFieldProps & {
  /** leadingIconButtonをクリックしたときの処理 */
  onClickLeadingIcon?: () => void;
  /** placeholder */
  supportingText?: string;
  /** inputの右側に表示する要素(iconやavatarなど) */
  trailingElement?: ReactNode;
  /** inputの左側に表示するアイコン、デフォルトはSearchIcon */
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
      "aria-label": ariaLabel, // Destructure aria-label here
      ...props
    },
    ref,
  ) => {
    return (
      <SearchField
        ref={ref}
        {...props}
        aria-label={ariaLabel} // Use the destructured ariaLabel
        className={styles.search}
      >
        <div className={styles.inputWrapper}>
          <Button onPress={onClickLeadingIcon} className={styles.leadingIcon}>
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

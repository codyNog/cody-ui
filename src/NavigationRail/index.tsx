"use client";
import {
  type ComponentProps,
  type ElementType,
  type ReactNode,
  forwardRef,
  useCallback,
} from "react";
import { useFocusRing } from "react-aria";
import { Link } from "react-aria-components";
import { Badge } from "../Badge";
import styles from "./index.module.css";

/**
 * Represents a single item in the NavigationRail.
 */
export type NavigationItem = {
  /** Unique identifier for the item. */
  id: string;
  /** The label text for the item. */
  label: string;
  /** The icon element to display. */
  icon: ReactNode;
  /** Optional badge to display on the item. Can be a number, "large", or "small". */
  badge?: number | "large" | "small";
  /** Whether the item is disabled. */
  disabled?: boolean;
  /** Optional click handler for the item. */
  onClick?: () => void;
  /** Optional URL to navigate to when the item is clicked. */
  href?: string;
  /** Whether the item is currently active. */
  isActive?: boolean;
};

/**
 * Props for the NavigationRail component.
 */
type Props = {
  /** An array of NavigationItem objects to display in the rail. */
  items: NavigationItem[];
  /** Optional Floating Action Button (FAB) to display at the top of the rail. */
  fab?: ReactNode;
  /** Callback function invoked when the selected item changes. */
  onSelectionChange?: (id: string) => void;
  /** Optional custom component to be used for rendering links. Defaults to a standard `<a>` tag or `react-aria-components/Link`. */
  linkComponent?: ElementType;
  /** Callback function invoked when the hover state of an item changes. */
  onHoverChange?: (key: string | undefined) => void;
} & Omit<ComponentProps<"div">, "children">;

/**
 * Props for the internal NavigationRailItem component.
 */
type NavigationRailItemProps = {
  /** The navigation item data. */
  item: NavigationItem;
  /** Callback function invoked when the item is pressed. */
  onPress: () => void;
  /** Optional custom component for rendering links. */
  linkComponent?: ElementType;
  /** Callback for hover state changes. */
  onHoverChange?: (key: string | undefined) => void;
};

const NavigationRailItem = ({
  item,
  onPress,
  linkComponent: LinkComponentProp,
  onHoverChange,
}: NavigationRailItemProps) => {
  const { isFocused, focusProps } = item.href
    ? { isFocused: false, focusProps: {} }
    : useFocusRing();

  const itemContent = (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{item.icon}</span>
        {item.badge !== undefined && (
          <div className={styles.badgeContainer}>
            {typeof item.badge === "number" && (
              <Badge variant="large" count={item.badge} />
            )}
            {item.badge === "small" && <Badge variant="small" />}
            {item.badge === "large" && <Badge variant="small" />}
          </div>
        )}
      </div>
      <span className={styles.label}>{item.label}</span>
    </>
  );

  const itemClassName = `${styles.item} ${
    item.isActive ? styles.active : ""
  } ${item.disabled ? styles.disabled : ""} ${
    isFocused && !item.href ? styles.focused : ""
  }`;

  if (item.href) {
    const LinkComponent = LinkComponentProp || Link;
    const commonLinkProps = {
      className: itemClassName,
      children: itemContent,
    };

    if (LinkComponent === Link) {
      return (
        <Link
          {...commonLinkProps}
          href={item.href}
          aria-disabled={item.disabled}
          onPress={() => {
            if (!item.disabled) {
              onPress();
            }
          }}
          onHoverChange={(isHovering) => {
            if (isHovering) {
              onHoverChange?.(item.id);
            }
          }}
        />
      );
    }
    return (
      <LinkComponent
        {...commonLinkProps}
        href={item.href}
        aria-disabled={item.disabled}
        onClick={() => {
          if (!item.disabled) {
            onPress();
            item.onClick?.();
          }
        }}
        onMouseEnter={() => onHoverChange?.(item.id)}
      />
    );
  }

  return (
    <div
      {...focusProps}
      className={itemClassName}
      onClick={() => {
        if (!item.disabled) {
          onPress();
        }
      }}
      onKeyDown={(e) => {
        if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
          onPress();
        }
      }}
      onMouseEnter={() => onHoverChange?.(item.id)}
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-pressed={item.isActive && !item.disabled}
      aria-disabled={item.disabled}
      aria-label={item.label}
    >
      {itemContent}
    </div>
  );
};

NavigationRailItem.displayName = "NavigationRailItem";

/**
 * NavigationRail component provides a persistent vertical navigation bar.
 * It typically displays icons and labels for top-level navigation destinations.
 */
export const NavigationRail = forwardRef<HTMLDivElement, Props>(
  (
    {
      items,
      fab,
      onSelectionChange,
      linkComponent,
      className,
      onHoverChange,
      ...props
    },
    ref,
  ) => {
    const handlePress = useCallback(
      (pressedItem: NavigationItem) => {
        if (pressedItem.disabled) {
          return;
        }
        pressedItem.onClick?.();
        onSelectionChange?.(pressedItem.id);
      },
      [onSelectionChange],
    );

    return (
      <div
        ref={ref}
        className={`${styles.base} ${className ?? ""}`}
        {...props}
        role="navigation"
      >
        {fab && <div className={styles.fab}>{fab}</div>}
        {items.map((item) => (
          <NavigationRailItem
            key={item.id}
            item={item}
            onPress={() => handlePress(item)}
            linkComponent={linkComponent}
            onHoverChange={onHoverChange}
          />
        ))}
      </div>
    );
  },
);

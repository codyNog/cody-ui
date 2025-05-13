"use client";
import {
  type ElementType,
  type ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Drawer } from "vaul";
import { Divider } from "../Divider";
import { MdArrowDropDown, MdArrowDropUp } from "../Icons";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Defines the possible types for a navigation drawer item.
 */
type NavigationDrawerItemType = "link" | "header" | "divider" | "group";

/**
 * Base type for all navigation drawer items.
 * @template T - The specific type of the navigation drawer item.
 */
type BaseNavigationDrawerItem<T extends NavigationDrawerItemType> = {
  /** Unique identifier for the item. Required for React keys and selection management. */
  id: string;
  /** The type of the navigation item. */
  type: T;
  /** The display label for the item. Not applicable to 'divider' type. */
  label?: T extends "divider" ? never : string;
  /** An optional icon for the item. Not applicable to 'divider' or 'header' types. */
  icon?: T extends "divider" | "header" ? never : ReactNode;
  /** The nesting level of the item, used for indentation. */
  level?: number;
};

/**
 * Represents the data structure for a navigation drawer item.
 * This type uses conditional types to define specific properties based on the `type` field.
 * @template T - The specific type of the navigation drawer item.
 */
type NavigationDrawerItemData<
  T extends NavigationDrawerItemType = NavigationDrawerItemType,
> = T extends "link"
  ? BaseNavigationDrawerItem<"link"> & {
      /** The URL the link points to. */
      href: string;
      /** An optional badge to display next to the link. */
      badge?: string | number;
      /** Indicates if the link is currently active (e.g., matches the current URL path). */
      isActive?: boolean;
    }
  : T extends "header"
    ? BaseNavigationDrawerItem<"header">
    : T extends "divider"
      ? BaseNavigationDrawerItem<"divider">
      : T extends "group"
        ? BaseNavigationDrawerItem<"group"> & {
            /** An array of items within the group. Currently supports 'link' and 'divider' types. */
            items: Array<NavigationDrawerItemData<"link" | "divider">>;
            /** Whether the group should be expanded by default. */
            isInitiallyExpanded?: boolean;
          }
        : never;

// Item Components

/**
 * Props for the LinkItemComponent.
 */
type LinkItemProps = {
  /** The link item data. */
  item: NavigationDrawerItemData<"link">;
  /** Whether the item is currently active. */
  isActive: boolean;
  /** Callback function when the item is clicked. */
  onClick?: (item: NavigationDrawerItemData<"link">) => void;
  /** Custom component to render the link. Defaults to 'a'. */
  linkComponent?: ElementType;
  /** The nesting level of the item. */
  level?: number;
};
const LinkItemComponent = ({
  item,
  isActive,
  onClick,
  linkComponent: LinkComponent = "a",
  level = 0,
}: LinkItemProps) => {
  const paddingLeft = 12 + level * 24;

  return (
    <LinkComponent
      key={item.id}
      href={item.href}
      to={item.href}
      onClick={() => {
        onClick?.(item);
      }}
      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
      aria-current={isActive ? "page" : undefined}
      style={{ paddingLeft: `${paddingLeft}px` }}
    >
      <div className={styles.stateLayer} />
      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
      <Typography
        variant="labelLarge"
        color={isActive ? "onSecondaryContainer" : "onSurfaceVariant"}
      >
        {item.label}
      </Typography>
      {item.badge != null && (
        <span className={styles.itemBadgeContainer}>
          <Typography
            variant="labelLarge"
            color={isActive ? "onSecondaryContainer" : "onSurfaceVariant"}
          >
            {item.badge}
          </Typography>
        </span>
      )}
    </LinkComponent>
  );
};

/**
 * Props for the HeaderItemComponent.
 */
type HeaderItemProps = {
  /** The header item data. */
  item: NavigationDrawerItemData<"header">;
};
const HeaderItemComponent = ({ item }: HeaderItemProps) => (
  <div key={item.id} className={styles.sectionHeader}>
    <Typography variant="titleSmall" color="onSurfaceVariant">
      {item.label}
    </Typography>
  </div>
);

/**
 * Props for the GroupItemComponent.
 */
type GroupItemProps = {
  /** The group item data. */
  item: NavigationDrawerItemData<"group">;
  /** Whether the group is currently expanded. */
  isExpanded: boolean;
  /** Callback function to toggle the expanded state of the group. */
  onToggleGroup: (groupId: string) => void;
  /** Function to render the sub-items of the group. */
  renderSubItems: (
    itemsToRender: Array<NavigationDrawerItemData>,
    currentLevel: number,
  ) => ReactNode;
  /** The ID of the currently selected item. */
  selectedItemId?: string;
  /** Callback function when a link item within the group is clicked. */
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  /** The nesting level of the group item. */
  level?: number;
};
const GroupItemComponent = ({
  item,
  isExpanded,
  onToggleGroup,
  renderSubItems,
  level = 0,
}: GroupItemProps) => {
  const paddingLeft = 12 + level * 24;
  return (
    <div key={item.id} className={styles.groupItem}>
      <div
        className={styles.groupLabel}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => onToggleGroup(item.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggleGroup(item.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`group-content-${item.id}`}
      >
        {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
        <span className={styles.groupLabelText}>
          <Typography variant="labelLarge" color="onSurfaceVariant">
            {item.label}
          </Typography>
        </span>
        <span className={styles.groupExpandIcon}>
          {isExpanded ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </span>
      </div>
      {isExpanded && (
        <ul className={styles.groupItems} id={`group-content-${item.id}`}>
          {renderSubItems(item.items, level + 1)}
        </ul>
      )}
    </div>
  );
};

/**
 * Internal recursive component to render navigation items.
 */
const Component = ({
  items,
  selectedItemId,
  onItemClick,
  expandedGroups,
  toggleGroup,
  linkComponent,
  currentLevel = 0,
}: {
  items: Array<NavigationDrawerItemData>;
  selectedItemId?: string;
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupId: string) => void;
  linkComponent?: ElementType;
  currentLevel?: number;
}) => {
  return (
    <>
      {items.map((item) => {
        const isActive =
          item.id === selectedItemId || (item.type === "link" && item.isActive);
        const itemLevel = item.level ?? currentLevel;

        switch (item.type) {
          case "link":
            return (
              <LinkItemComponent
                key={item.id}
                item={item}
                isActive={!!isActive}
                onClick={onItemClick}
                linkComponent={linkComponent}
                level={itemLevel}
              />
            );
          case "header":
            return <HeaderItemComponent key={item.id} item={item} />;
          case "divider":
            return <Divider />;
          case "group": {
            return (
              <GroupItemComponent
                key={item.id}
                item={item}
                isExpanded={!!expandedGroups[item.id]}
                onToggleGroup={toggleGroup}
                renderSubItems={(subItems, nextLevel) => (
                  <Component
                    items={subItems}
                    selectedItemId={selectedItemId}
                    onItemClick={onItemClick}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    linkComponent={linkComponent}
                    currentLevel={nextLevel}
                  />
                )}
                selectedItemId={selectedItemId}
                onItemClick={onItemClick}
                level={itemLevel}
              />
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Defines the structure for a section within the NavigationDrawer.
 */
export type NavigationDrawerSection = {
  /** Unique identifier for the section (for React key). */
  id: string;
  /** Optional headline for the section. */
  headline?: string;
  /** The list of items within this section. */
  items: Array<NavigationDrawerItemData>;
};

/**
 * Props for the NavigationDrawer component.
 */
type Props = {
  /** The variant of the navigation drawer. @default "standard" */
  variant?: "standard" | "modal";
  /** The list of sections to display in the drawer. */
  sections: Array<NavigationDrawerSection>;
  /** Controls the open state for the modal variant. */
  open?: boolean;
  /** Callback function when the modal drawer is closed. */
  onClose?: () => void;
  /** Callback function when a link item is clicked. */
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  /** The ID of the currently selected item. */
  selectedItemId?: string;
  /** Custom component to render links. Defaults to 'a'. */
  linkComponent?: ElementType;
};

/**
 * NavigationDrawer component provides a slide-out panel for navigation.
 * It supports standard and modal variants, sections, and nested groups.
 */
export const NavigationDrawer = forwardRef<HTMLDivElement, Props>(
  (
    {
      variant = "standard",
      sections,
      open,
      onClose,
      onItemClick,
      selectedItemId,
      linkComponent,
    },
    ref,
  ) => {
    const [expandedGroups, setExpandedGroups] = useState<
      Record<string, boolean>
    >({});

    const toggleGroup = (groupId: string) => {
      setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    useEffect(() => {
      const initialExpansionState: Record<string, boolean> = {};
      for (const section of sections) {
        for (const item of section.items) {
          if (item.type === "group" && item.isInitiallyExpanded) {
            initialExpansionState[item.id] = true;
          }
        }
      }
      setExpandedGroups(initialExpansionState);
    }, [sections]);

    if (variant === "modal") {
      return (
        <Drawer.Root open={open} onClose={onClose} direction="left">
          <Drawer.Portal>
            <Drawer.Overlay className={styles.modalOverlay} />
            <Drawer.Content ref={ref} className={styles.modalContent}>
              <ul className={styles.list}>
                {sections.map((section) => (
                  <li key={section.id} className={styles.section}>
                    {section.headline && (
                      <div className={styles.sectionHeadline}>
                        <Typography
                          variant="titleSmall"
                          color="onSurfaceVariant"
                        >
                          {section.headline}
                        </Typography>
                      </div>
                    )}
                    <Component
                      items={section.items}
                      selectedItemId={selectedItemId}
                      onItemClick={onItemClick}
                      expandedGroups={expandedGroups}
                      toggleGroup={toggleGroup}
                      linkComponent={linkComponent}
                    />
                  </li>
                ))}
              </ul>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      );
    }

    const standardClassName = `${styles.root} ${styles.standard} ${open ? styles.standardVisible : ""}`;

    return (
      <div ref={ref} className={standardClassName}>
        <ul className={styles.list}>
          {sections.map((section) => (
            <li key={section.id} className={styles.section}>
              {section.headline && (
                <div className={styles.sectionHeadline}>
                  <Typography variant="titleSmall" color="onSurfaceVariant">
                    {section.headline}
                  </Typography>
                </div>
              )}
              <Component
                items={section.items}
                selectedItemId={selectedItemId}
                onItemClick={onItemClick}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                linkComponent={linkComponent}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

NavigationDrawer.displayName = "NavigationDrawer";

import type { ComponentProps, ReactNode } from "react";
import {
  MenuTrigger,
  Popover,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  Separator,
  SubmenuTrigger,
  composeRenderProps,
} from "react-aria-components";
import type {
  Key,
  PopoverProps,
  MenuProps as RACMenuProps,
  Selection,
  SeparatorProps,
} from "react-aria-components";
import { Typography } from "../Typography";
import styles from "./index.module.css";

// Type Definitions

/**
 * Defines the data structure for a menu item or a separator.
 * Can be nested to create submenus.
 */
type MenuItemData = {
  /** Unique identifier for the item (required). */
  id: string | number;
  /**
   * Type of the item (default: 'item').
   * 'item': A standard menu item.
   * 'separator': A visual divider line.
   */
  type?: "item" | "separator";
  /** Display label for the item (required if type='item'). */
  label?: ReactNode;
  /** Icon displayed to the left of the label (optional, only for type='item'). */
  leadingIcon?: ReactNode;
  /** Icon displayed to the right of the label (optional, only for type='item'). */
  trailingIcon?: ReactNode;
  /** Whether the item is disabled (optional, only for type='item'). */
  isDisabled?: boolean;
  /** Array of MenuItemData for submenu items (optional, only for type='item'). */
  items?: ReadonlyArray<MenuItemData>;
};

/**
 * Props for the Menu component.
 */
type Props = {
  /** The trigger element that opens the menu (required). Typically a Button. */
  children: ReactNode;
  /** Array of item/separator data to display in the menu (required). */
  items: ReadonlyArray<MenuItemData>;
  /**
   * Callback invoked when a menu item is selected (optional).
   * Receives the `id` (Key) of the selected item.
   */
  onAction?: (key: Key) => void;
  /**
   * Placement of the menu relative to the trigger (optional, default: 'bottom start').
   * Uses react-aria-components Popover placement options.
   */
  placement?: PopoverProps["placement"];
  /** The offset of the menu relative to the trigger (optional). */
  offset?: number;
  /** Whether the menu should match the width of the trigger (optional, default: false). */
  matchTriggerWidth?: boolean;
  /** Whether the entire menu is disabled (optional, default: false). */
  isDisabled?: boolean;
  /** Accessibility label for the menu (optional). */
  "aria-label"?: string;

  /**
   * Selection mode.
   * @default 'none'
   */
  selectionMode?: RACMenuProps<object>["selectionMode"];
  /** The currently selected keys (controlled). */
  selectedKeys?: Selection;
  /** The initially selected keys (uncontrolled). */
  defaultSelectedKeys?: Selection;
  /** Callback invoked when the selection changes. */
  onSelectionChange?: (keys: Selection) => void;
};

// Internal Components

/**
 * Props for the InternalMenuItem component.
 */
type MenuItemProps = ComponentProps<typeof RACMenuItem> & {
  /** The data for the menu item. */
  item: MenuItemData;
};

const InternalMenuItem = ({ item, ...props }: MenuItemProps) => {
  return (
    <RACMenuItem
      {...props}
      id={item.id}
      isDisabled={item.isDisabled}
      className={composeRenderProps(
        props.className,
        (className, { isFocused, isDisabled: racIsDisabled }) =>
          `${styles.menuItem} ${className || ""} ${
            isFocused ? styles.focused : ""
          } ${racIsDisabled ? styles.disabled : ""}`.trim(),
      )}
    >
      {item.leadingIcon && (
        <span className={styles.leadingIcon}>{item.leadingIcon}</span>
      )}
      <Typography variant="bodyLarge" color="onSurface" slot="label">
        {item.label}
      </Typography>
      {item.trailingIcon && (
        <span className={styles.trailingIcon}>{item.trailingIcon}</span>
      )}
    </RACMenuItem>
  );
};

/**
 * Props for the InternalMenuSeparator component.
 */
type MenuSeparatorProps = SeparatorProps;

const InternalMenuSeparator = (props: MenuSeparatorProps) => {
  return <Separator {...props} className={styles.separator} />;
};

// Recursive Menu Rendering Function

/**
 * Renders menu items, including separators and submenus.
 * @param items - An array of MenuItemData objects.
 * @returns An array of ReactNode elements representing the menu items.
 */
const renderMenuItems = (items: ReadonlyArray<MenuItemData>): ReactNode[] => {
  return items.map((item) => {
    if (item.type === "separator") {
      return <InternalMenuSeparator key={item.id} />;
    }

    if (item.items && item.items.length > 0) {
      return (
        <SubmenuTrigger key={item.id}>
          <InternalMenuItem item={item} />
          <Popover className={styles.popover}>
            <RACMenu className={styles.menu}>
              {renderMenuItems(item.items)}
            </RACMenu>
          </Popover>
        </SubmenuTrigger>
      );
    }

    return <InternalMenuItem key={item.id} item={item} />;
  });
};

/**
 * Menu component that displays a list of actions or options.
 * It can be triggered by a button or other element.
 * Supports submenus and selection modes.
 */
export const Menu = ({
  children,
  items,
  onAction,
  placement = "bottom start",
  offset,
  matchTriggerWidth = true,
  isDisabled,
  "aria-label": ariaLabel,
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
}: Props) => {
  const menuProps: RACMenuProps<object> = {
    onAction,
    "aria-label": ariaLabel,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys: isDisabled
      ? items.map((item: MenuItemData) => item.id)
      : undefined,
  };

  return (
    <MenuTrigger>
      {children}
      <Popover
        placement={placement}
        offset={offset}
        className={`${styles.popover} ${matchTriggerWidth ? styles.matchTriggerWidthPopover : ""}`}
      >
        <RACMenu {...menuProps} className={styles.menu}>
          {renderMenuItems(items)}
        </RACMenu>
      </Popover>
    </MenuTrigger>
  );
};

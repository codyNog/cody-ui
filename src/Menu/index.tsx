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
  Key, // Key も react-aria-components からインポート (react-aria からでも良いが統一)
  PopoverProps,
  MenuProps as RACMenuProps,
  Selection, // Selection を react-aria-components からインポート
  SeparatorProps,
} from "react-aria-components";
import styles from "./index.module.css";

// --- Type Definitions based on docs/components/Menu.md ---

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
  items?: ReadonlyArray<MenuItemData>; // ここも ReadonlyArray に変更
};

/**
 * Props for the Menu component.
 */
type MenuProps = {
  /** The trigger element that opens the menu (required). Typically a Button. */
  children: ReactNode;
  /** Array of item/separator data to display in the menu (required). */
  items: ReadonlyArray<MenuItemData>; // ReadonlyArray を許容するように変更
  /**
   * Callback invoked when a menu item is selected (optional).
   * Receives the `id` (Key) of the selected item.
   */
  onAction?: (key: Key) => void;
  /**
   * Placement of the menu relative to the trigger (optional, default: 'bottom start').
   * Uses react-aria-components Popover placement options.
   */
  placement?: PopoverProps["placement"]; // Use PopoverProps['placement']
  /** The offset of the menu relative to the trigger (optional). */
  offset?: number;
  /** Whether the menu should match the width of the trigger (optional, default: false). */
  matchTriggerWidth?: boolean;
  /** Whether the entire menu is disabled (optional, default: false). */
  isDisabled?: boolean;
  /** Accessibility label for the menu (optional). */
  "aria-label"?: string;

  // --- Selection Props ---
  /**
   * Selection mode (optional, default: 'none').
   * 'none': No selection allowed.
   * 'single': Only one item can be selected.
   * 'multiple': Multiple items can be selected.
   */
  selectionMode?: RACMenuProps<object>["selectionMode"]; // Use RACMenuProps
  /**
   * The currently selected keys (controlled) (optional).
   */
  selectedKeys?: Selection;
  /**
   * The initially selected keys (uncontrolled) (optional).
   */
  defaultSelectedKeys?: Selection;
  /**
   * Callback invoked when the selection changes (optional).
   * Receives the new selection state (Selection).
   */
  onSelectionChange?: (keys: Selection) => void;
  // --- End Selection Props ---
};

// --- Internal Components ---

type InternalMenuItemProps = ComponentProps<typeof RACMenuItem> & {
  item: MenuItemData; // Pass item data
};

const InternalMenuItem = ({ item, ...props }: InternalMenuItemProps) => {
  return (
    <RACMenuItem
      {...props}
      id={item.id} // Use id from item data
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
      <span className={styles.label}>{item.label}</span>
      {item.trailingIcon && (
        <span className={styles.trailingIcon}>{item.trailingIcon}</span>
      )}
    </RACMenuItem>
  );
};

type InternalMenuSeparatorProps = SeparatorProps;

const InternalMenuSeparator = (props: InternalMenuSeparatorProps) => {
  return <Separator {...props} className={styles.separator} />;
};

// --- Recursive Menu Rendering Function ---

const renderMenuItems = (items: ReadonlyArray<MenuItemData>): ReactNode[] => {
  // ReadonlyArray を受け入れる
  return items.map((item) => {
    if (item.type === "separator") {
      // Use item.id as key for separator as well, ensure it's unique
      return <InternalMenuSeparator key={item.id} />;
    }

    // Handle items with submenus
    if (item.items && item.items.length > 0) {
      return (
        <SubmenuTrigger key={item.id}>
          <InternalMenuItem item={item} />
          <Popover className={styles.popover}>
            {/* Recursively render submenu items */}
            <RACMenu className={styles.menu}>
              {renderMenuItems(item.items)}
            </RACMenu>
          </Popover>
        </SubmenuTrigger>
      );
    }

    // Standard menu item
    return <InternalMenuItem key={item.id} item={item} />;
  });
};

// --- Main Menu Component ---

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
}: MenuProps) => {
  const menuProps: RACMenuProps<object> = {
    onAction,
    "aria-label": ariaLabel,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys: isDisabled ? items.map((item) => item.id) : undefined, // Disable all if menu is disabled
  };

  return (
    <MenuTrigger>
      {children}
      <Popover
        placement={placement}
        offset={offset} // Pass offset to Popover
        className={`${styles.popover} ${matchTriggerWidth ? styles.matchTriggerWidthPopover : ""}`}
      >
        <RACMenu {...menuProps} className={styles.menu}>
          {renderMenuItems(items)}
        </RACMenu>
      </Popover>
    </MenuTrigger>
  );
};

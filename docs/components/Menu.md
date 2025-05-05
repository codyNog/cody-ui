# Menu Component Props Design

This document outlines the props design for the `Menu` component.

## Overview

-   **Component Name**: `Menu`
-   **Foundation**: Built upon `react-aria-components` (`MenuTrigger`, `Menu`, `MenuItem`, `Popover`, `SubmenuTrigger`, `Separator`).
-   **Design**: Adheres to Material Design 3 (M3) guidelines.

## Props Definition

```typescript
import type { ReactNode } from 'react';
import type { Key } from 'react-aria'; // Key type from react-aria
import type { MenuTriggerProps, Selection } from 'react-aria-components'; // Types from react-aria-components

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
  type?: 'item' | 'separator';
  /** Display label for the item (required if type='item'). */
  label?: ReactNode;
  /** Icon displayed to the left of the label (optional, only for type='item'). */
  leadingIcon?: ReactNode;
  /** Icon displayed to the right of the label (optional, only for type='item'). */
  trailingIcon?: ReactNode;
  /** Whether the item is disabled (optional, only for type='item'). */
  isDisabled?: boolean;
  /** Array of MenuItemData for submenu items (optional, only for type='item'). */
  children?: MenuItemData[];
};

/**
 * Props for the Menu component.
 */
type MenuProps = {
  /** The trigger element that opens the menu (required). Typically a Button. */
  children: ReactNode;
  /** Array of item/separator data to display in the menu (required). */
  items: MenuItemData[];
  /**
   * Callback invoked when a menu item is selected (optional).
   * Receives the `id` (Key) of the selected item.
   */
  onAction?: (key: Key) => void;
  /**
   * Placement of the menu relative to the trigger (optional, default: 'bottom start').
   * Uses react-aria-components Popover placement options.
   */
  placement?: MenuTriggerProps['placement'];
  /** Whether the entire menu is disabled (optional, default: false). */
  isDisabled?: boolean;
  /** Accessibility label for the menu (optional). */
  'aria-label'?: string;

  // --- Selection Props ---
  /**
   * Selection mode (optional, default: 'none').
   * 'none': No selection allowed.
   * 'single': Only one item can be selected.
   * 'multiple': Multiple items can be selected.
   */
  selectionMode?: 'none' | 'single' | 'multiple';
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
```

## Component Structure (Mermaid Diagram)

```mermaid
graph TD
    App -->|uses| MenuComponent[Menu];
    MenuComponent -->|wraps| AriaMenuTrigger[react-aria-components/MenuTrigger];
    AriaMenuTrigger --> TriggerElement(children Prop: e.g., Button);
    AriaMenuTrigger --> Popover1[react-aria-components/Popover];
    Popover1 --> Menu1[react-aria-components/Menu];

    subgraph Menu Level 1
        Menu1 -->|generates from 'items' (type='item')| MenuItem1[react-aria-components/MenuItem];
        Menu1 -->|generates from 'items' (type='separator')| Separator1[react-aria-components/Separator];
        Menu1 -->|generates if item has children| SubmenuTrigger1[react-aria-components/SubmenuTrigger];
    end

    SubmenuTrigger1 --> MenuItemWithSubmenu(MenuItem with children);
    SubmenuTrigger1 --> Popover2[react-aria-components/Popover];
    Popover2 --> Menu2[react-aria-components/Menu];

    subgraph Menu Level 2 (Submenu)
        Menu2 -->|generates from item.children (type='item')| MenuItem2[react-aria-components/MenuItem];
        Menu2 -->|generates from item.children (type='separator')| Separator2[react-aria-components/Separator];
        Menu2 -->|can nest further| SubmenuTrigger2[react-aria-components/SubmenuTrigger];
        SubmenuTrigger2 --> ...
    end

    style MenuComponent fill:#f9f,stroke:#333,stroke-width:2px
    style TriggerElement fill:#ccf,stroke:#333,stroke-width:1px
    style MenuItemWithSubmenu fill:#ffc,stroke:#333,stroke-width:1px
    style Separator1 fill:#eee,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
    style Separator2 fill:#eee,stroke:#999,stroke-width:1px,stroke-dasharray: 5 5
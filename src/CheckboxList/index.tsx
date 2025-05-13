import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import styles from "./index.module.css";

/**
 * Represents the possible states of a checkbox.
 */
type CheckboxState = "checked" | "unchecked" | "indeterminate";

/**
 * Represents an item in the CheckboxList.
 */
type CheckboxListItem = {
  /** A unique identifier for the item. */
  id: string;
  /** The display label for the checkbox item. */
  label: string;
  /** The current state of the checkbox item. */
  state: CheckboxState;
  /** An optional array of child checkbox items for creating a nested structure. */
  children?: CheckboxListItem[];
  /** Whether this specific item is disabled. */
  isDisabled?: boolean;
};

/**
 * Props for the CheckboxList component.
 */
type Props = {
  /** An array of checkbox items to display. */
  items: CheckboxListItem[];
  /** Callback function invoked when the state of any checkbox item changes.
   * It receives the updated array of items.
   */
  onChange?: (updatedItems: CheckboxListItem[]) => void;
};

/**
 * @internal
 * Helper function to map `CheckboxState` to the `checked` prop of the `Checkbox` component.
 * @param {CheckboxState} state - The current state of the checkbox item.
 * @returns {boolean | "indeterminate"} The value for the `Checkbox` component's `checked` prop.
 */
const mapStateToProps = (state: CheckboxState): boolean | "indeterminate" => {
  if (state === "indeterminate") {
    return "indeterminate";
  }
  return state === "checked";
};

/**
 * @internal
 * Helper function to determine the new state of a parent item based on its children's states.
 * - If all children are checked, the parent is checked.
 * - If all children are unchecked, the parent is unchecked.
 * - Otherwise, the parent is indeterminate.
 * @param {CheckboxListItem[]} children - The array of child items.
 * @returns {CheckboxState} The determined state for the parent item.
 */
const determineParentState = (children: CheckboxListItem[]): CheckboxState => {
  if (!children || children.length === 0) {
    return "unchecked"; // Or based on specific logic if a parent with no children has a default state
  }
  const allChecked = children.every((child) => child.state === "checked");
  const allUnchecked = children.every((child) => child.state === "unchecked");

  if (allChecked) {
    return "checked";
  }
  if (allUnchecked) {
    return "unchecked";
  }
  return "indeterminate";
};

/**
 * @internal
 * Recursively updates the state of a target item and its descendants,
 * and then re-evaluates the state of its ancestors.
 * @param {CheckboxListItem[]} items - The current list of items.
 * @param {string} targetId - The ID of the item whose state is to be changed.
 * @param {CheckboxState} newState - The new state for the target item.
 * @returns {CheckboxListItem[]} The updated list of items.
 */
const updateItemState = (
  items: CheckboxListItem[],
  targetId: string,
  newState: CheckboxState,
): CheckboxListItem[] => {
  return items.map((item) => {
    const newItem = { ...item };
    if (newItem.id === targetId) {
      newItem.state = newState;
      // If the item has children, update their state based on the parent's new state
      if (newItem.children) {
        newItem.children = newItem.children.map((child) =>
          updateChildStateRecursive(child, newState),
        );
      }
    } else if (newItem.children) {
      // If not the target item, but has children, recurse
      newItem.children = updateItemState(newItem.children, targetId, newState);
      // After children are updated, re-determine this item's state
      newItem.state = determineParentState(newItem.children);
    }
    return newItem;
  });
};

/**
 * @internal
 * Helper function to recursively update the state of a child item and its descendants.
 * If the parent's state is 'checked' or 'unchecked', all children adopt that state.
 * If the parent's state becomes 'indeterminate', children retain their current state
 * (this typically happens when a child is unchecked, making the parent indeterminate).
 * @param {CheckboxListItem} item - The child item to update.
 * @param {CheckboxState} parentState - The new state of the parent item.
 * @returns {CheckboxListItem} The updated child item.
 */
const updateChildStateRecursive = (
  item: CheckboxListItem,
  parentState: CheckboxState,
): CheckboxListItem => {
  // If parent is checked/unchecked, child follows. If parent is indeterminate, child keeps its state.
  const newState = parentState === "indeterminate" ? item.state : parentState;
  const newItem = { ...item, state: newState };
  if (newItem.children) {
    newItem.children = newItem.children.map((child) =>
      updateChildStateRecursive(child, newState),
    );
  }
  return newItem;
};

/**
 * @internal
 * Renders a single checkbox item and its children recursively.
 */
const ChildCheckboxList = ({
  item,
  handleCheckboxChange,
}: {
  item: CheckboxListItem;
  handleCheckboxChange: (itemId: string) => void;
}) => {
  return (
    <div key={item.id} className={styles.item}>
      <Checkbox
        checked={mapStateToProps(item.state)}
        onChangeChecked={() => handleCheckboxChange(item.id)}
        disabled={item.isDisabled}
        label={item.label}
        aria-label={item.label} // Ensure aria-label for accessibility if label is not sufficient
        value={item.id}
      />
      {item.children && item.children.length > 0 && (
        <div className={styles.children}>
          {item.children.map((child) => (
            <ChildCheckboxList
              key={child.id}
              item={child}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * A CheckboxList component that displays a list of checkboxes,
 * potentially in a nested (tree-like) structure.
 * It handles the logic for parent/child checkbox state interactions
 * (e.g., checking a parent checks all children, unchecking a child
 * can make a parent indeterminate).
 *
 * @example
 * ```tsx
 * const initialItems = [
 *   { id: '1', label: 'All Fruits', state: 'unchecked', children: [
 *     { id: '1-1', label: 'Apple', state: 'unchecked' },
 *     { id: '1-2', label: 'Banana', state: 'unchecked' },
 *   ]},
 *   { id: '2', label: 'All Vegetables', state: 'unchecked', children: [
 *     { id: '2-1', label: 'Carrot', state: 'unchecked' },
 *     { id: '2-2', label: 'Broccoli', state: 'unchecked' },
 *   ]},
 * ];
 *
 * <CheckboxList items={initialItems} onChange={(updatedItems) => console.log(updatedItems)} />
 * ```
 */
export function CheckboxList({ items: initialItems, onChange }: Props) {
  const [internalItems, setInternalItems] =
    useState<CheckboxListItem[]>(initialItems);

  // Effect to update internal state if the initialItems prop changes
  useEffect(() => {
    setInternalItems(initialItems);
  }, [initialItems]);

  /**
   * @internal
   * Handles the change event for an individual checkbox.
   * It determines the next state of the clicked item and then updates
   * the entire list's state accordingly (including parent/child relationships).
   */
  const handleCheckboxChange = useCallback(
    (itemId: string) => {
      let newItems = [...internalItems];
      // Find the current state of the clicked item
      const currentState = findItemById(newItems, itemId)?.state ?? "unchecked";
      // Determine the next state (toggle between checked/unchecked)
      const nextState = currentState === "checked" ? "unchecked" : "checked";
      // Update the state of the clicked item and propagate changes
      newItems = updateItemState(newItems, itemId, nextState);
      setInternalItems(newItems);
      onChange?.(newItems);
    },
    [internalItems, onChange],
  );

  /**
   * @internal
   * Finds a specific item within the nested list by its ID.
   * @param {CheckboxListItem[]} items - The list of items to search within.
   * @param {string} id - The ID of the item to find.
   * @returns {CheckboxListItem | null} The found item, or null if not found.
   */
  const findItemById = (
    items: CheckboxListItem[],
    id: string,
  ): CheckboxListItem | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return (
    <div className={styles.root}>
      {internalItems.map((item) => (
        <ChildCheckboxList
          key={item.id}
          item={item}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
}

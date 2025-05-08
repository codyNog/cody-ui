import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import styles from "./index.module.css";

// チェックボックスの状態を表す型 (exportを削除)
type CheckboxState = "checked" | "unchecked" | "indeterminate";

// CheckboxListの各アイテムを表す型 (exportを削除)
type CheckboxListItem = {
  id: string; // 各アイテムの一意なID
  label: string; // 表示ラベル
  state: CheckboxState; // 現在の状態
  children?: CheckboxListItem[]; // 子アイテムの配列（オプション）
  isDisabled?: boolean; // ★ 個々のアイテムの無効状態か（オプション）
};

type Props = {
  items: CheckboxListItem[]; // 表示するアイテムの配列
  onChange?: (updatedItems: CheckboxListItem[]) => void; // 状態変更時に呼ばれるコールバック
};

// CheckboxStateをCheckboxコンポーネントのpropsに変換するヘルパー
const mapStateToProps = (state: CheckboxState): boolean | "indeterminate" => {
  if (state === "indeterminate") {
    return "indeterminate";
  }
  return state === "checked";
};

// 子要素の状態から親要素の新しい状態を決定するヘルパー関数
const determineParentState = (children: CheckboxListItem[]): CheckboxState => {
  if (!children || children.length === 0) {
    return "unchecked";
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

// アイテムとその子孫の状態を更新する再帰関数
const updateItemState = (
  items: CheckboxListItem[],
  targetId: string,
  newState: CheckboxState,
): CheckboxListItem[] => {
  return items.map((item) => {
    const newItem = { ...item };
    if (newItem.id === targetId) {
      newItem.state = newState;
      if (newItem.children) {
        newItem.children = newItem.children.map((child) =>
          updateChildStateRecursive(child, newState),
        );
      }
    } else if (newItem.children) {
      newItem.children = updateItemState(newItem.children, targetId, newState);
      newItem.state = determineParentState(newItem.children);
    }
    return newItem;
  });
};

// 子要素の状態を再帰的に更新するヘルパー
const updateChildStateRecursive = (
  item: CheckboxListItem,
  parentState: CheckboxState,
): CheckboxListItem => {
  const newState = parentState === "indeterminate" ? item.state : parentState;
  const newItem = { ...item, state: newState };
  if (newItem.children) {
    newItem.children = newItem.children.map((child) =>
      updateChildStateRecursive(child, newState),
    );
  }
  return newItem;
};

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
        disabled={item.isDisabled} // ★ Group全体のisDisabledは考慮せず、アイテム自身のものだけ見る
        label={item.label}
        aria-label={item.label}
        value={item.id} // valueはCheckboxのpropsにあるので残す
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

export function CheckboxList({ items: initialItems, onChange }: Props) {
  // ★ PropsからCheckboxGroup関連を削除
  const [internalItems, setInternalItems] =
    useState<CheckboxListItem[]>(initialItems);

  useEffect(() => {
    setInternalItems(initialItems);
  }, [initialItems]);

  const handleCheckboxChange = useCallback(
    (itemId: string) => {
      let newItems = [...internalItems];
      const currentState = findItemById(newItems, itemId)?.state ?? "unchecked";
      const nextState = currentState === "checked" ? "unchecked" : "checked";
      newItems = updateItemState(newItems, itemId, nextState);
      setInternalItems(newItems);
      if (onChange) {
        onChange(newItems);
      }
    },
    [internalItems, onChange],
  );

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

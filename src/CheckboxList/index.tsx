import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "../Checkbox"; // 既存のCheckboxコンポーネントをインポート
import styles from "./index.module.css";

// チェックボックスの状態を表す型 (exportを削除)
type CheckboxState = "checked" | "unchecked" | "indeterminate";

// CheckboxListの各アイテムを表す型 (exportを削除)
type CheckboxListItem = {
  id: string; // 各アイテムの一意なID
  label: string; // 表示ラベル
  state: CheckboxState; // 現在の状態
  children?: CheckboxListItem[]; // 子アイテムの配列（オプション）
  isDisabled?: boolean; // 無効状態か（オプション）
  // 他に必要なプロパティがあればここに追加
};

type Props = {
  items: CheckboxListItem[]; // 表示するアイテムの配列
  onChange?: (updatedItems: CheckboxListItem[]) => void; // 状態変更時に呼ばれるコールバック
};

// CheckboxStateをCheckboxコンポーネントのpropsに変換するヘルパー
const mapStateToProps = (state: CheckboxState) => {
  return {
    isSelected: state === "checked",
    isIndeterminate: state === "indeterminate",
  };
};

// 子要素の状態から親要素の新しい状態を決定するヘルパー関数
const determineParentState = (children: CheckboxListItem[]): CheckboxState => {
  if (!children || children.length === 0) {
    return "unchecked"; // 子がいなければ未チェック（理論上ここには来ないはず）
  }
  const allChecked = children.every((child) => child.state === "checked");
  const allUnchecked = children.every((child) => child.state === "unchecked");

  if (allChecked) {
    return "checked";
  }
  if (allUnchecked) {
    return "unchecked";
  }
  return "indeterminate"; // 上記以外は中間状態
};

// アイテムとその子孫の状態を更新する再帰関数
const updateItemState = (
  items: CheckboxListItem[],
  targetId: string,
  newState: CheckboxState,
): CheckboxListItem[] => {
  return items.map((item) => {
    const newItem = { ...item }; // let -> const
    if (newItem.id === targetId) {
      newItem.state = newState;
      // 子要素も再帰的に更新
      if (newItem.children) {
        newItem.children = newItem.children.map((child) =>
          updateChildStateRecursive(child, newState),
        );
      }
    } else if (newItem.children) {
      // 子要素の中にターゲットがいるか再帰的に探す
      newItem.children = updateItemState(newItem.children, targetId, newState);
      // 子要素の更新後、親の状態を再計算
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
  // 親がチェック/未チェックなら子もそれに合わせる
  // 親がindeterminateの場合は子の状態は変更しない（通常は親クリックでchecked/uncheckedになるため）
  const newState = parentState === "indeterminate" ? item.state : parentState;
  const newItem = { ...item, state: newState }; // let -> const
  if (newItem.children) {
    newItem.children = newItem.children.map((child) =>
      updateChildStateRecursive(child, newState),
    );
  }
  return newItem;
};

export function CheckboxList({ items: initialItems, onChange }: Props) {
  const [internalItems, setInternalItems] =
    useState<CheckboxListItem[]>(initialItems);

  // props.items が変更されたら内部状態も更新
  useEffect(() => {
    setInternalItems(initialItems);
  }, [initialItems]);

  const handleCheckboxChange = useCallback(
    (itemId: string) => {
      let newItems = [...internalItems]; // 現在の状態をコピー

      // クリックされたアイテムの新しい状態を決定
      // indeterminateの場合はcheckedにする、checkedの場合はuncheckedにする
      const currentState = findItemById(newItems, itemId)?.state ?? "unchecked";
      const nextState = currentState === "checked" ? "unchecked" : "checked";

      // アイテムとその子孫の状態を更新
      newItems = updateItemState(newItems, itemId, nextState);

      // 親の状態を再帰的に更新
      // updateParentStates はルートから探索し、変更があったアイテムの親の状態を更新する
      // updateItemState で既に子の状態は更新されているので、
      // ここでは親の状態をボトムアップで更新するイメージ
      // ただし、updateItemState内でも親の状態更新は行われるため、
      // この呼び出しが冗長になる可能性もある。ロジックを要確認。
      // → updateItemState内で親の状態更新を行う方が自然かもしれない。
      //   一旦、updateItemStateに親更新ロジックを集約する方向で修正済み。

      setInternalItems(newItems); // 内部状態を更新

      // 変更を親コンポーネントに通知
      if (onChange) {
        onChange(newItems);
      }
    },
    [internalItems, onChange],
  );

  // IDでアイテムを検索するヘルパー（状態取得用）
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

  // 各アイテムをレンダリングする再帰関数
  const renderItem = (item: CheckboxListItem) => {
    const { isSelected, isIndeterminate } = mapStateToProps(item.state);

    return (
      <div key={item.id} className={styles.item}>
        <Checkbox
          isSelected={isSelected}
          isIndeterminate={isIndeterminate}
          onChange={() => handleCheckboxChange(item.id)} // クリック時にIDを渡す
          isDisabled={item.isDisabled}
          aria-label={item.label} // アクセシビリティのため
        >
          {item.label}
        </Checkbox>
        {item.children && item.children.length > 0 && (
          <div className={styles.children}>
            {item.children.map((child) => renderItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.root}>
      {internalItems.map((item) => renderItem(item))}
    </div>
  );
}

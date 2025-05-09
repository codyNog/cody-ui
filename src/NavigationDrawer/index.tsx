"use client";
import { forwardRef, type ReactNode, useState, useEffect } from "react";
import { Drawer } from "vaul";
import { MdChevronRight, MdExpandMore } from "../Icons"; // アイコンをインポート
import styles from "./index.module.css";

// ItemType を定義
export type NavigationDrawerItemType = "link" | "header" | "divider" | "group";

// ベースとなる Item の型定義
// id は React の key や選択状態の管理に使うため必須とする
type BaseNavigationDrawerItem<T extends NavigationDrawerItemType> = {
  id: string;
  type: T;
  // divider には label は不要
  label?: T extends "divider" ? never : string;
  // link と group のみが icon を持てる想定 (M3 の Standard drawer の Section header には icon がないため)
  icon?: T extends "divider" | "header" ? never : ReactNode;
};

// Conditional Types を使って Item 型を定義
export type NavigationDrawerItemData<
  // 型名を変更して Data サフィックスを追加
  T extends NavigationDrawerItemType = NavigationDrawerItemType,
> = T extends "link"
  ? BaseNavigationDrawerItem<"link"> & {
      href: string;
      badge?: string | number;
      // active 状態を示すプロパティ（例: 現在のパスと href が一致する場合など）
      isActive?: boolean;
    }
  : T extends "header"
    ? BaseNavigationDrawerItem<"header">
    : T extends "divider"
      ? BaseNavigationDrawerItem<"divider">
      : T extends "group"
        ? BaseNavigationDrawerItem<"group"> & {
            // group の items は一旦 link と divider のみとする (M3 の例参考)
            // ネストした group が必要な場合は Item[] に変更する
            items: Array<NavigationDrawerItemData<"link" | "divider">>; // ここも変更
            isInitiallyExpanded?: boolean; // 初期状態で展開しておくか
          }
        : never;

// --- Item Components ---
type LinkItemProps = {
  item: NavigationDrawerItemData<"link">;
  isActive: boolean;
  onClick?: (item: NavigationDrawerItemData<"link">) => void;
};
const LinkItemComponent = ({ item, isActive, onClick }: LinkItemProps) => (
  <li key={item.id}>
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(item);
      }}
      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className={styles.stateLayer} />
      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
      <span className={styles.itemLabel}>{item.label}</span>
      {item.badge != null && (
        <span className={styles.itemBadge}>{item.badge}</span>
      )}
    </a>
  </li>
);

type HeaderItemProps = {
  item: NavigationDrawerItemData<"header">;
};
const HeaderItemComponent = ({ item }: HeaderItemProps) => (
  <li key={item.id} className={styles.sectionHeader}>
    {item.label}
  </li>
);

type DividerItemProps = {
  item: NavigationDrawerItemData<"divider">;
};
const DividerItemComponent = ({ item }: DividerItemProps) => (
  <li key={item.id} className={styles.divider} />
);

type GroupItemProps = {
  item: NavigationDrawerItemData<"group">;
  isExpanded: boolean;
  onToggleGroup: (groupId: string) => void;
  renderSubItems: (itemsToRender: Array<NavigationDrawerItemData>) => ReactNode; // 型変更
  selectedItemId?: string; // selectedItemId を GroupItem にも渡す
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void; // onItemClick を GroupItem にも渡す
};
const GroupItemComponent = ({
  item,
  isExpanded,
  onToggleGroup,
  renderSubItems,
}: GroupItemProps) => (
  <li key={item.id} className={styles.groupItem}>
    <div
      className={styles.groupLabel}
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
      <span className={styles.itemLabel}>{item.label}</span>
      <span className={styles.groupExpandIcon}>
        {isExpanded ? <MdExpandMore /> : <MdChevronRight />}
      </span>
    </div>
    {isExpanded && (
      <ul className={styles.groupItems} id={`group-content-${item.id}`}>
        {renderSubItems(item.items)}
      </ul>
    )}
  </li>
);
// --- End Item Components ---

const Component = ({
  items,
  selectedItemId,
  onItemClick,
  expandedGroups,
  toggleGroup,
}: {
  items: Array<NavigationDrawerItemData>;
  selectedItemId?: string;
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupId: string) => void;
}) => {
  return (
    <>
      {items.map((item) => {
        const isActive =
          item.id === selectedItemId || (item.type === "link" && item.isActive);
        switch (item.type) {
          case "link":
            return (
              <LinkItemComponent
                key={item.id}
                item={item}
                isActive={!!isActive}
                onClick={onItemClick}
              />
            );
          case "header":
            return <HeaderItemComponent key={item.id} item={item} />;
          case "divider":
            return <DividerItemComponent key={item.id} item={item} />;
          case "group": {
            return (
              <GroupItemComponent
                key={item.id}
                item={item}
                isExpanded={!!expandedGroups[item.id]}
                onToggleGroup={toggleGroup}
                renderSubItems={(subItems) => (
                  <Component
                    items={subItems}
                    selectedItemId={selectedItemId}
                    onItemClick={onItemClick}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                  />
                )} // 再帰的に自身を渡す
                selectedItemId={selectedItemId} // selectedItemId を渡す
                onItemClick={onItemClick} // onItemClick を渡す
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

type Props = {
  variant: "standard" | "modal";
  items: Array<NavigationDrawerItemData>; // 型変更
  headline?: string;
  // modal の場合の開閉状態を制御
  open?: boolean;
  // modal が閉じられたときのコールバック
  onClose?: () => void;
  // アイテムがクリックされたときのコールバック
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void; // 型変更
  // 選択されているアイテムの id
  selectedItemId?: string;
};

export const NavigationDrawer = forwardRef<HTMLDivElement, Props>(
  (
    { variant, items, headline, open, onClose, onItemClick, selectedItemId },
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
      const setupInitialExpansion = (
        currentItems: NavigationDrawerItemData[], // 型変更
      ) => {
        for (const item of currentItems) {
          if (item.type === "group") {
            initialExpansionState[item.id] = !!item.isInitiallyExpanded;
            // Note: If groups can be nested, this needs to be recursive
            // if (item.items) setupInitialExpansion(item.items);
          }
        }
      };
      setupInitialExpansion(items);
      setExpandedGroups(initialExpansionState);
    }, [items]);

    if (variant === "modal") {
      return (
        <Drawer.Root open={open} onClose={onClose} direction="left">
          <Drawer.Portal>
            <Drawer.Overlay className={styles.modalOverlay} />
            <Drawer.Content ref={ref} className={styles.modalContent}>
              {headline && (
                <Drawer.Title className={styles.headline}>
                  {headline}
                </Drawer.Title>
              )}
              <ul className={styles.list}>
                <Component
                  items={items}
                  selectedItemId={selectedItemId}
                  onItemClick={onItemClick}
                  expandedGroups={expandedGroups}
                  toggleGroup={toggleGroup}
                />
              </ul>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      );
    }

    // Standard Navigation Drawer
    return (
      <div ref={ref} className={`${styles.root} ${styles.standard}`}>
        {headline && <h2 className={styles.headline}>{headline}</h2>}
        <ul className={styles.list}>
          <Component
            items={items}
            selectedItemId={selectedItemId}
            onItemClick={onItemClick}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
          />
        </ul>
      </div>
    );
  },
);

NavigationDrawer.displayName = "NavigationDrawer";

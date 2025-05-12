"use client";
import {
  type ElementType,
  type ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react"; // ElementType をインポート
import { Drawer } from "vaul";
import { MdChevronRight, MdExpandMore } from "../Icons"; // アイコンをインポート
import { Typography } from "../Typography"; // Typography をインポート
import styles from "./index.module.css";

// ItemType を定義
type NavigationDrawerItemType = "link" | "header" | "divider" | "group";

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
type NavigationDrawerItemData<
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
  /** The link item data. */
  item: NavigationDrawerItemData<"link">;
  /** Whether the item is currently active. */
  isActive: boolean;
  /** Callback function when the item is clicked. */
  onClick?: (item: NavigationDrawerItemData<"link">) => void;
  /** Custom component to render the link. Defaults to 'a'. */
  linkComponent?: ElementType; // React. を削除
};
const LinkItemComponent = ({
  item,
  isActive,
  onClick,
  linkComponent: LinkComponent = "a",
}: LinkItemProps) => (
  <li key={item.id}>
    <LinkComponent
      href={item.href}
      onClick={() => {
        onClick?.(item);
      }}
      className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
      aria-current={isActive ? "page" : undefined}
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
        <Typography
          variant="labelLarge"
          color={isActive ? "onSecondaryContainer" : "onSurfaceVariant"}
        >
          {item.badge}
        </Typography>
      )}
    </LinkComponent>
  </li>
);

type HeaderItemProps = {
  item: NavigationDrawerItemData<"header">;
};
const HeaderItemComponent = ({ item }: HeaderItemProps) => (
  <li key={item.id} className={styles.sectionHeader}>
    <Typography variant="titleSmall" color="onSurfaceVariant">
      {item.label}
    </Typography>
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
      <Typography variant="labelLarge" color="onSurfaceVariant">
        {item.label}
      </Typography>
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
  linkComponent, // Pass linkComponent down
}: {
  items: Array<NavigationDrawerItemData>;
  selectedItemId?: string;
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupId: string) => void;
  linkComponent?: ElementType; // React. を削除
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
                linkComponent={linkComponent} // Pass linkComponent to LinkItemComponent
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
                    linkComponent={linkComponent} // Pass linkComponent recursively
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

// セクションごとのデータを定義する型
export type NavigationDrawerSection = {
  /** Unique identifier for the section (for React key). */
  id: string;
  /** Optional headline for the section. */
  headline?: string;
  /** The list of items within this section. */
  items: Array<NavigationDrawerItemData>;
};

type Props = {
  /** The variant of the navigation drawer. */
  variant: "standard" | "modal";
  /** The list of sections to display in the drawer. */
  sections: Array<NavigationDrawerSection>; // items を sections に変更
  // headline?: string; // トップレベルの headline は削除
  /** Controls the open state for the modal variant. */
  open?: boolean;
  /** Callback function when the modal drawer is closed. */
  onClose?: () => void;
  /** Callback function when a link item is clicked. */
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void; // 型変更
  /** The ID of the currently selected item. */
  selectedItemId?: string;
  /** Custom component to render links. Defaults to 'a'. */
  linkComponent?: ElementType; // React. を削除
};

export const NavigationDrawer = forwardRef<HTMLDivElement, Props>(
  (
    {
      variant,
      // items, // items を削除
      // headline, // headline を削除
      sections, // sections を追加
      open,
      onClose,
      onItemClick,
      selectedItemId,
      linkComponent, // Destructure linkComponent
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
      // sections を走査するように変更
      for (const section of sections) {
        for (const item of section.items) {
          if (item.type === "group" && item.isInitiallyExpanded) {
            initialExpansionState[item.id] = true;
            // Note: If groups can be nested, this needs to be recursive
            // if (item.items) setupInitialExpansion(item.items); // Group 内の Group は現状未対応
          }
        }
      }
      setExpandedGroups(initialExpansionState);
    }, [sections]); // items を sections に変更

    if (variant === "modal") {
      return (
        <Drawer.Root open={open} onClose={onClose} direction="left">
          <Drawer.Portal>
            <Drawer.Overlay className={styles.modalOverlay} />
            <Drawer.Content ref={ref} className={styles.modalContent}>
              {/* headline は削除 */}
              <ul className={styles.list}>
                {/* sections をループして表示 */}
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
                      items={section.items} // section.items を渡す
                      selectedItemId={selectedItemId}
                      onItemClick={onItemClick}
                      expandedGroups={expandedGroups}
                      toggleGroup={toggleGroup}
                      linkComponent={linkComponent} // Pass linkComponent to Component
                    />
                  </li>
                ))}
              </ul>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      );
    }

    // Standard Navigation Drawer
    // Add standardVisible class when open is true for animation
    const standardClassName = `${styles.root} ${styles.standard} ${open ? styles.standardVisible : ""}`;

    // Standard Navigation Drawer
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
                items={section.items} // section.items を渡す
                selectedItemId={selectedItemId}
                onItemClick={onItemClick}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
                linkComponent={linkComponent} // Pass linkComponent to Component
              />
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

NavigationDrawer.displayName = "NavigationDrawer";

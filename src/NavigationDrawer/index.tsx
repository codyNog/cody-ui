"use client";
import {
  type ElementType,
  type ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react"; // ElementType をインポート
import { Drawer } from "vaul";
import { Divider } from "../Divider";
import { MdArrowDropDown, MdArrowDropUp } from "../Icons"; // アイコンをインポート
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
  level?: number; // ネストレベル
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
  const paddingLeft = 12 + level * 24; // ベース12px + levelごとに24pxインデント

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

type HeaderItemProps = {
  item: NavigationDrawerItemData<"header">;
};
const HeaderItemComponent = ({ item }: HeaderItemProps) => (
  <div key={item.id} className={styles.sectionHeader}>
    <Typography variant="titleSmall" color="onSurfaceVariant">
      {item.label}
    </Typography>
  </div>
);

type GroupItemProps = {
  item: NavigationDrawerItemData<"group">;
  isExpanded: boolean;
  onToggleGroup: (groupId: string) => void;
  renderSubItems: (
    itemsToRender: Array<NavigationDrawerItemData>,
    currentLevel: number,
  ) => ReactNode; // 型変更 + currentLevel
  selectedItemId?: string; // selectedItemId を GroupItem にも渡す
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void; // onItemClick を GroupItem にも渡す
  level?: number; // ネストレベル
};
const GroupItemComponent = ({
  item,
  isExpanded,
  onToggleGroup,
  renderSubItems,
  level = 0,
}: GroupItemProps) => {
  const paddingLeft = 12 + level * 24; // ベース12px + levelごとに24pxインデント
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
// --- End Item Components ---

const Component = ({
  items,
  selectedItemId,
  onItemClick,
  expandedGroups,
  toggleGroup,
  linkComponent, // Pass linkComponent down
  currentLevel = 0, // Add currentLevel with a default value
}: {
  items: Array<NavigationDrawerItemData>;
  selectedItemId?: string;
  onItemClick?: (item: NavigationDrawerItemData<"link">) => void;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (groupId: string) => void;
  linkComponent?: ElementType; // React. を削除
  currentLevel?: number; // Add currentLevel to props type
}) => {
  return (
    <>
      {items.map((item) => {
        const isActive =
          item.id === selectedItemId || (item.type === "link" && item.isActive);
        const itemLevel = item.level ?? currentLevel; // Use item.level if defined, otherwise currentLevel

        switch (item.type) {
          case "link":
            return (
              <LinkItemComponent
                key={item.id}
                item={item}
                isActive={!!isActive}
                onClick={onItemClick}
                linkComponent={linkComponent} // Pass linkComponent to LinkItemComponent
                level={itemLevel} // Pass level to LinkItemComponent
              />
            );
          case "header":
            // HeaderItemComponent にも level を渡す場合は、props とスタイル調整が必要
            return <HeaderItemComponent key={item.id} item={item} />;
          case "divider":
            // Divider にも level に応じた margin/padding が必要な場合は調整
            return <Divider />;
          case "group": {
            return (
              <GroupItemComponent
                key={item.id}
                item={item}
                isExpanded={!!expandedGroups[item.id]}
                onToggleGroup={toggleGroup}
                renderSubItems={(
                  subItems,
                  nextLevel, // renderSubItems に nextLevel を追加
                ) => (
                  <Component
                    items={subItems}
                    selectedItemId={selectedItemId}
                    onItemClick={onItemClick}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    linkComponent={linkComponent} // Pass linkComponent recursively
                    currentLevel={nextLevel} // Pass nextLevel as currentLevel for recursion
                  />
                )}
                selectedItemId={selectedItemId} // selectedItemId を渡す
                onItemClick={onItemClick} // onItemClick を渡す
                level={itemLevel} // Pass level to GroupItemComponent
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
  variant?: "standard" | "modal";
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
      variant = "standard",
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

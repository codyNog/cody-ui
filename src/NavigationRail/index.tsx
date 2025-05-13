"use client";
import {
  type ComponentProps,
  type ElementType, // ElementType をインポート
  type ReactNode,
  forwardRef,
  useCallback,
  // useState, // useState を削除 (activeId state を削除したため)
} from "react";
import { useFocusRing } from "react-aria";
import { Link } from "react-aria-components"; // Button のインポートを削除
import { Badge } from "../Badge"; // Badgeコンポーネントをインポート (パス修正)
import styles from "./index.module.css";

export type NavigationItem = {
  // export を追加
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | "large" | "small";
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  isActive?: boolean; // isActive プロパティを追加
};

type Props = {
  items: NavigationItem[];
  fab?: ReactNode;
  // defaultSelectedId?: string; // defaultSelectedId を削除
  onSelectionChange?: (id: string) => void;
  linkComponent?: ElementType;
  onHoverChange?: (key: string | undefined) => void; // key を string | undefined に変更
} & Omit<ComponentProps<"div">, "children">;

type NavigationRailItemProps = {
  item: NavigationItem; // item が isActive を持つようになる
  // isActive: boolean; // item.isActive を使うため削除
  onPress: () => void;
  linkComponent?: ElementType;
  onHoverChange?: (key: string | undefined) => void; // key を string | undefined に変更
};

// eslint-disable-next-line react/display-name
const NavigationRailItem = ({
  item,
  // isActive, // item.isActive を使うため削除
  onPress,
  linkComponent: LinkComponentProp,
  onHoverChange,
}: NavigationRailItemProps) => {
  const { isFocused, focusProps } = item.href // useFocusRing を再度使う
    ? { isFocused: false, focusProps: {} }
    : useFocusRing();

  const itemContent = (
    <>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{item.icon}</span>
        {/* 新しいBadgeコンポーネントを使用 */}
        {item.badge !== undefined && (
          <div className={styles.badgeContainer}>
            {" "}
            {/* Badgeの位置調整用コンテナ */}
            {typeof item.badge === "number" && (
              <Badge variant="large" count={item.badge} />
            )}
            {item.badge === "small" && <Badge variant="small" />}
            {/* item.badge === "large" の場合、M3のlargeはcountが必須なため、smallで代用 */}
            {/* もしテキスト等を表示したい場合はBadgeコンポーネントの改修かNavigationItemの型変更が必要 */}
            {item.badge === "large" && <Badge variant="small" />}
          </div>
        )}
      </div>
      <span className={styles.label}>{item.label}</span>
    </>
  );

  const itemClassName = `${styles.item} ${
    item.isActive ? styles.active : "" // item.isActive を使用
  } ${item.disabled ? styles.disabled : ""} ${
    isFocused && !item.href ? styles.focused : ""
  }`;

  if (item.href) {
    // linkComponent が指定されていればそれを使う、なければデフォルトの Link を使う
    const LinkComponent = LinkComponentProp || Link;
    const commonLinkProps = {
      className: itemClassName,
      children: itemContent,
      // Link とカスタムコンポーネントで共通して渡せるプロパティ
    };

    if (LinkComponent === Link) {
      // デフォルトの react-aria-components の Link を使う場合
      return (
        <Link
          {...commonLinkProps}
          href={item.href}
          aria-disabled={item.disabled}
          onPress={() => {
            if (!item.disabled) {
              onPress();
            }
          }}
          onHoverChange={(isHovering) => {
            if (isHovering) {
              onHoverChange?.(item.id);
            }
          }}
          // tabIndex は Link が管理
        />
      );
    }
    // カスタムの linkComponent を使う場合
    // 注意: カスタムコンポーネントは LinkProps と互換性のある props を受け取る想定
    // 必要に応じて onClick や aria-disabled のハンドリングが必要
    return (
      <LinkComponent
        {...commonLinkProps}
        href={item.href}
        aria-disabled={item.disabled} // aria-disabled を渡す
        onClick={() => {
          // href がある場合は、onPress (onSelectionChange) と item.onClick の両方を考慮
          if (!item.disabled) {
            onPress(); // onSelectionChange をトリガー
            item.onClick?.();
          }
        }}
        onMouseEnter={() => onHoverChange?.(item.id)}
      />
    );
  }

  return (
    <div
      {...focusProps}
      className={itemClassName}
      onClick={() => {
        if (!item.disabled) {
          onPress();
        }
      }}
      onKeyDown={(e) => {
        if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
          onPress();
        }
      }}
      onMouseEnter={() => onHoverChange?.(item.id)}
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-pressed={item.isActive && !item.disabled} // item.isActive を使用
      aria-disabled={item.disabled}
      aria-label={item.label}
    >
      {itemContent}
    </div>
  );
};

export const NavigationRail = forwardRef<HTMLDivElement, Props>(
  (
    {
      items,
      fab,
      // defaultSelectedId, // 削除
      onSelectionChange,
      linkComponent,
      className,
      onHoverChange,
      ...props
    },
    ref,
  ) => {
    // const [activeId, setActiveId] = useState<string | undefined>(
    //   defaultSelectedId,
    // ); // activeId state を削除

    const handlePress = useCallback(
      (pressedItem: NavigationItem) => {
        // item を pressedItem に変更
        if (pressedItem.disabled) {
          return;
        }
        // setActiveId(pressedItem.id); // activeId の更新を削除
        pressedItem.onClick?.();
        onSelectionChange?.(pressedItem.id); // 選択されたアイテムのIDを通知
      },
      [onSelectionChange], // 依存配列から activeId を削除
    );

    return (
      <div
        ref={ref}
        className={`${styles.base} ${className ?? ""}`}
        {...props}
        role="navigation"
      >
        {fab && <div className={styles.fab}>{fab}</div>}
        {items.map((item) => (
          <NavigationRailItem
            key={item.id}
            item={item} // item をそのまま渡す (isActive を含む)
            // isActive={activeId === item.id} // item.isActive を使うため削除
            onPress={() => handlePress(item)}
            linkComponent={linkComponent}
            onHoverChange={onHoverChange}
          />
        ))}
      </div>
    );
  },
);

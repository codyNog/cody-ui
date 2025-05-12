"use client";
import {
  type ComponentProps,
  type ElementType, // ElementType をインポート
  type ReactNode,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { useFocusRing } from "react-aria"; // useFocusRing を再インポート
import { Link } from "react-aria-components"; // Button のインポートを削除
import { Badge } from "../Badge"; // Badgeコンポーネントをインポート (パス修正)
import styles from "./index.module.css";

type NavigationItem = {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | "large" | "small";
  disabled?: boolean;
  onClick?: () => void; // onPressMenu を onClick に変更
  href?: string;
  onHoverChange?: (key: string) => void; // ホバー状態変更時のコールバックを追加
};

type Props = {
  items: NavigationItem[];
  fab?: ReactNode;
  defaultSelectedId?: string;
  onSelectionChange?: (id: string) => void;
  linkComponent?: ElementType; // linkComponent プロパティを追加
  onHoverChange?: (key: string) => void; // ホバー状態変更時のコールバックを追加
} & Omit<ComponentProps<"div">, "children">;

type NavigationRailItemProps = {
  item: NavigationItem;
  isActive: boolean;
  onPress: () => void;
  linkComponent?: ElementType; // linkComponent の型定義
  onHoverChange?: (key: string) => void; // ホバー状態変更時のコールバックを追加
};

// eslint-disable-next-line react/display-name
const NavigationRailItem = ({
  item,
  isActive,
  onPress,
  linkComponent: LinkComponentProp, // linkComponent を Props から受け取る
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
    isActive ? styles.active : ""
  } ${item.disabled ? styles.disabled : ""} ${
    // disabled クラスを適用
    isFocused && !item.href ? styles.focused : "" // focused クラスを再度適用
  }`;

  if (item.href) {
    // linkComponent が指定されていればそれを使う、なければデフォルトの Link を使う
    const LinkComponent = LinkComponentProp || Link;
    const commonLinkProps = {
      className: itemClassName,
      children: itemContent,
      onHoverChange,
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
          onHoverChange={() => onHoverChange?.(item.id)}
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
          item.onClick?.(); // アイテム固有の onClick も実行 (もしあれば)
        }}
      />
    );
  }

  return (
    <div // Button を div に戻す
      {...focusProps} // focusProps を適用
      className={itemClassName}
      onClick={() => {
        // onPress を onClick に戻す
        if (!item.disabled) {
          onPress();
        }
      }}
      onKeyDown={(e) => {
        // onKeyDown を戻す
        if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
          onPress();
        }
      }}
      onMouseEnter={() => item.onHoverChange?.(item.id)} // onHoverChange のためのハンドラを追加
      onMouseLeave={() => item.onHoverChange?.("")} // onHoverChange のためのハンドラを追加
      role="button" // role を戻す
      tabIndex={item.disabled ? -1 : 0} // tabIndex を戻す
      aria-pressed={isActive && !item.disabled} // aria-pressed を戻す
      aria-disabled={item.disabled} // aria-disabled を戻す (isDisabled は削除)
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
      defaultSelectedId,
      onSelectionChange,
      linkComponent, // linkComponent を props から受け取る
      className,
      onHoverChange,
      ...props
    },
    ref,
  ) => {
    const [activeId, setActiveId] = useState<string | undefined>(
      defaultSelectedId,
    );

    const handlePress = useCallback(
      (item: NavigationItem) => {
        if (item.disabled) {
          return;
        }
        setActiveId(item.id);
        item.onClick?.(); // onPressMenu を onClick に変更
        onSelectionChange?.(item.id);
      },
      [onSelectionChange],
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
            item={item}
            isActive={activeId === item.id}
            onPress={() => handlePress(item)}
            linkComponent={linkComponent} // linkComponent を渡す
          />
        ))}
      </div>
    );
  },
);

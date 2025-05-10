"use client";
import {
  type ComponentProps,
  type ReactNode,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { useFocusRing } from "react-aria"; // VisuallyHidden を削除
import { Link } from "react-aria-components";
import { Badge } from "../Badge"; // Badgeコンポーネントをインポート (パス修正)
import styles from "./index.module.css";

type NavigationItem = {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | "large" | "small";
  disabled?: boolean;
  onClickMenu?: () => void; // onPressMenu を onClickMenu に変更
  href?: string;
};

type Props = {
  items: NavigationItem[];
  fab?: ReactNode;
  defaultSelectedId?: string;
  onSelectionChange?: (id: string) => void;
} & Omit<ComponentProps<"div">, "children">;

// eslint-disable-next-line react/display-name
const NavigationRailItem = ({
  item,
  isActive,
  onPress,
}: {
  item: NavigationItem;
  isActive: boolean;
  onPress: () => void;
}) => {
  const { isFocused, focusProps } = item.href
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
    isFocused && !item.href ? styles.focused : ""
  }`;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={itemClassName}
        aria-disabled={item.disabled} // isDisabled を aria-disabled に渡す
        onPress={() => {
          if (!item.disabled) {
            onPress();
          }
        }}
        // tabIndex は Link コンポーネントが自動で管理するため削除
      >
        {itemContent}
      </Link>
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
      role="button"
      tabIndex={item.disabled ? -1 : 0}
      aria-pressed={isActive && !item.disabled}
      aria-disabled={item.disabled}
      aria-label={item.label}
    >
      {itemContent}
    </div>
  );
};

export const NavigationRail = forwardRef<HTMLDivElement, Props>(
  (
    { items, fab, defaultSelectedId, onSelectionChange, className, ...props },
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
        item.onClickMenu?.(); // onPressMenu を onClickMenu に変更
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
          />
        ))}
      </div>
    );
  },
);

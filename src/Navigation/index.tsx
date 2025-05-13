"use client";
import type { ComponentProps, ElementType } from "react";
import { useCallback, useMemo, useState } from "react"; // useMemo を追加
import { Divider } from "../Divider";
import { NavigationDrawer } from "../NavigationDrawer";
import { NavigationRail } from "../NavigationRail";
import styles from "./index.module.css";

type Nv = {
  id: string;
  // NavigationRail の item 型 (ComponentProps から取得)
  item: ComponentProps<typeof NavigationRail>["items"][number];
  // NavigationDrawer の sections 型 (ComponentProps から取得)
  sections: ComponentProps<typeof NavigationDrawer>["sections"];
};

type Props = {
  linkComponent?: ElementType;
  navigations: Nv[];
  currentPath?: string; // 現在のパスを受け取る props を追加
};

export const Navigation = ({
  navigations,
  linkComponent,
  currentPath,
}: Props) => {
  const [hoveredRailItemId, setHoveredRailItemId] = useState<
    string | undefined
  >("");
  const isDrawerOpen =
    hoveredRailItemId !== "" && hoveredRailItemId !== undefined;

  const onHoverChange = useCallback((key: string | undefined) => {
    setHoveredRailItemId(key);
  }, []);

  // NavigationRail に渡すアイテムリストを生成 (isActive を currentPath に基づいて設定)
  const railItems = useMemo(
    () =>
      navigations.map((nv) => ({
        ...nv.item,
        // nv.item (NavigationRailのitem) に href があり、currentPath と一致すれば isActive: true
        // currentPath が未定義の場合は、元の isActive (もしあれば) を尊重、なければ false
        isActive:
          nv.item.href && currentPath
            ? nv.item.href === currentPath
            : (nv.item.isActive ?? false),
      })),
    [navigations, currentPath],
  );

  // NavigationDrawer に渡すセクションデータを生成 (各リンクアイテムの isActive を currentPath に基づいて設定)
  const drawerSections = useMemo(() => {
    const activeNavigation = navigations.find(
      (nv) => nv.id === hoveredRailItemId,
    );
    if (!activeNavigation) {
      return [];
    }
    return activeNavigation.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        // NavigationDrawer の item (特に type: 'link') に href があり、currentPath と一致すれば isActive: true
        if (item.type === "link" && item.href && currentPath) {
          return {
            ...item,
            isActive: item.href === currentPath,
          };
        }
        // type: 'link' 以外、または href や currentPath がない場合は元の item.isActive (もしあれば) を尊重
        return {
          ...item,
          isActive: item.type === "link" ? (item.isActive ?? false) : undefined, // link 以外は isActive を持たない想定
        };
      }),
    }));
  }, [navigations, hoveredRailItemId, currentPath]);

  // activeRailItemIdByPath は defaultSelectedId を渡すために使用していたが、
  // NavigationRail が items の isActive を直接見るようになったため不要になった
  // const activeRailItemIdByPath = useMemo(() => {
  //   if (!currentPath) return undefined;
  //   // railItems は isActive が設定済みなので、そこから探す
  //   const activeItem = railItems.find((item) => item.isActive);
  //   return activeItem?.id;
  // }, [railItems, currentPath]);

  return (
    <div className={styles.root} onMouseLeave={() => onHoverChange(undefined)}>
      <NavigationRail
        items={railItems} // isActive が設定された railItems を渡す
        linkComponent={linkComponent}
        onHoverChange={onHoverChange}
        // defaultSelectedId は削除したので渡さない
        // NavigationRail は items の isActive を見て初期状態を判断する
      />
      {isDrawerOpen && <Divider orientation="vertical" />}
      <NavigationDrawer
        sections={drawerSections} // isActive が設定された drawerSections を渡す
        open={isDrawerOpen}
        linkComponent={linkComponent}
        // selectedItemId は currentPath を渡すことで、Drawer内部で適切なアイテムがアクティブになることを期待
        // Drawer の item.isActive が優先されるはず
        selectedItemId={currentPath}
      />
    </div>
  );
};

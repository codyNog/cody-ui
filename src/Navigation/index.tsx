"use client";
import type { ComponentProps, ElementType } from "react";
import { useCallback, useMemo, useState } from "react";
import { Divider } from "../Divider";
import { NavigationDrawer } from "../NavigationDrawer";
import { NavigationRail } from "../NavigationRail";
import styles from "./index.module.css";

/**
 * Represents a single navigation entry, combining rail item and drawer sections.
 */
type Nv = {
  /** Unique identifier for the navigation entry. */
  id: string;
  /** Configuration for the NavigationRail item. */
  item: ComponentProps<typeof NavigationRail>["items"][number];
  /** Configuration for the NavigationDrawer sections. */
  sections: ComponentProps<typeof NavigationDrawer>["sections"];
};

/**
 * Props for the Navigation component.
 */
type Props = {
  /**
   * Optional custom component to be used for rendering links.
   * Defaults to a standard `<a>` tag.
   */
  linkComponent?: ElementType;
  /** An array of navigation configurations. */
  navigations: Nv[];
  /** The current URL path, used to determine the active navigation item. */
  currentPath?: string;
};

/**
 * Navigation component that combines a NavigationRail and a NavigationDrawer.
 * It provides a responsive navigation experience, showing a rail on larger screens
 * and a drawer that expands on hover or for smaller screens (drawer functionality
 * is primarily managed by the sub-components based on hover here).
 */
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

  const railItems = useMemo(
    () =>
      navigations.map((nv) => ({
        ...nv.item,
        isActive:
          nv.item.href && currentPath
            ? nv.item.href === currentPath
            : (nv.item.isActive ?? false),
      })),
    [navigations, currentPath],
  );

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
        if (item.type === "link" && item.href && currentPath) {
          return {
            ...item,
            isActive: item.href === currentPath,
          };
        }
        return {
          ...item,
          isActive: item.type === "link" ? (item.isActive ?? false) : undefined,
        };
      }),
    }));
  }, [navigations, hoveredRailItemId, currentPath]);

  return (
    <div className={styles.root} onMouseLeave={() => onHoverChange(undefined)}>
      <NavigationRail
        items={railItems}
        linkComponent={linkComponent}
        onHoverChange={onHoverChange}
      />
      {isDrawerOpen && <Divider orientation="vertical" />}
      <NavigationDrawer
        sections={drawerSections}
        open={isDrawerOpen}
        linkComponent={linkComponent}
        selectedItemId={currentPath}
      />
    </div>
  );
};

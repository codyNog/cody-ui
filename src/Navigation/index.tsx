"use client";
import { Link } from "react-aria-components";
import { NavigationDrawer } from "../NavigationDrawer";
import { NavigationRail } from "../NavigationRail";
import styles from "./index.module.css";
import { Divider } from "../Divider";
import type { ComponentProps, ElementType } from "react";
import { useCallback, useState } from "react";

type Props = {
  linkComponent?: ElementType;
  railItems: ComponentProps<typeof NavigationRail>["items"];
  drawerSections: (
    key: string,
  ) => ComponentProps<typeof NavigationDrawer>["sections"];
};

const useNavigation = ({ linkComponent, railItems, drawerSections }: Props) => {
  const [status, setStatus] = useState("");
  const isDrawerOpen = status !== "";

  const onHoverChange = useCallback((key: string) => {
    setStatus(key);
  }, []);

  const sections = drawerSections(status);

  return {
    railItems,
    drawerSections,
    status,
    isDrawerOpen,
    linkComponent,
    onHoverChange,
    sections,
  };
};

export const Navigation = (props: Props) => {
  const {
    railItems,
    isDrawerOpen,
    linkComponent = Link,
    onHoverChange,
    sections,
  } = useNavigation(props);
  return (
    <div className={styles.root} onMouseLeave={() => onHoverChange("")}>
      <NavigationRail
        items={railItems}
        linkComponent={linkComponent}
        onHoverChange={onHoverChange}
      />
      {isDrawerOpen && <Divider orientation="vertical" />}
      <NavigationDrawer
        open={isDrawerOpen}
        linkComponent={linkComponent}
        sections={sections}
      />
    </div>
  );
};

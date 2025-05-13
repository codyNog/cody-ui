"use client";
import { NavigationDrawer } from "../NavigationDrawer";
import { NavigationRail } from "../NavigationRail";
import styles from "./index.module.css";
import { Divider } from "../Divider";
import type { ComponentProps, ElementType } from "react";
import { useCallback, useState } from "react";

type Nv = {
  id: string;
  item: ComponentProps<typeof NavigationRail>["items"][number];
  sections: ComponentProps<typeof NavigationDrawer>["sections"];
};

type Props = {
  linkComponent?: ElementType;
  navigations: Nv[];
};

export const Navigation = ({ navigations, linkComponent }: Props) => {
  const [status, setStatus] = useState("");
  const isDrawerOpen = status !== "";
  const onHoverChange = useCallback((key: string) => {
    setStatus(key);
  }, []);

  const railItems = navigations.map((nv) => nv.item);
  const sections = navigations.find((nv) => nv.id === status)?.sections;

  return (
    <div className={styles.root} onMouseLeave={() => onHoverChange("")}>
      <NavigationRail
        items={railItems}
        linkComponent={linkComponent}
        onHoverChange={onHoverChange}
      />
      {isDrawerOpen && <Divider orientation="vertical" />}
      <NavigationDrawer
        sections={sections || []}
        open={isDrawerOpen}
        linkComponent={linkComponent}
      />
    </div>
  );
};

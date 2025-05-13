"use client";
import { Link } from "react-aria-components";
import { NavigationDrawer } from "../NavigationDrawer";
import { NavigationRail } from "../NavigationRail";
import { useNavigation } from "./hooks";
import styles from "./index.module.css";
import type { Props } from "./types"; // Corrected import path
import { Divider } from "../Divider";

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
        variant="standard"
        linkComponent={linkComponent}
        sections={sections}
      />
    </div>
  );
};

import type { ComponentProps, ElementType } from "react";
import type { NavigationDrawer } from "../../NavigationDrawer";
import type { NavigationRail } from "../../NavigationRail";

export type Props = {
  linkComponent?: ElementType;
  railItems: ComponentProps<typeof NavigationRail>["items"];
  drawerSections: (
    key: string,
  ) => ComponentProps<typeof NavigationDrawer>["sections"];
};

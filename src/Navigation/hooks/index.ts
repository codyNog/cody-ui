import { useCallback, useState } from "react";
import type { Props } from "../types";

export const useNavigation = ({
  linkComponent,
  railItems,
  drawerSections,
}: Props) => {
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

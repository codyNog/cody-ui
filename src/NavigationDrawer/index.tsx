"use client";
import { forwardRef, type ReactNode } from "react";

type Item = {
  type: "link" | "parent";
  label: string;
  icon?: ReactNode;
  href?: string; // link の場合のみ
  items?: Item[]; // parent の場合のみ
  badge?: string | number; // link の場合のみ
};

type Props = {
  variant: "standard" | "modal";
  items: Item[];
  headline?: string;
  isActive?: boolean;
};

export const NavigationDrawer = forwardRef<HTMLDivElement, Props>(
  (_props, ref) => {
    return <div ref={ref}>NavigationDrawer</div>;
  },
);

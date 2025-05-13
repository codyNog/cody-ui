"use client";
import { forwardRef, useState, type ReactNode } from "react";
import { useDisclosure } from "@react-aria/disclosure";
import type { DOMRefValue } from "@react-types/shared"; // Import DOMRef from @react-types/shared
import { MdArrowDropDown, MdArrowDropUp } from "../Icons";
import styles from "./index.module.css";

type Item = {
  id: string; // must be unique
  title: string;
  content: ReactNode;
};

type Props = {
  isDisabled?: boolean;
  items: Item[];
  defaultExpandedKeys?: Iterable<string>;
  defaultExpandedAll?: boolean;
  expandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Iterable<string>) => void;
  allowsMultipleExpanded?: boolean;
};

export const Accordion = forwardRef<DOMRefValue<HTMLDivElement>, Props>(
  (
    {
      isDisabled,
      items,
      defaultExpandedKeys: keys,
      expandedKeys: controlledExpandedKeys,
      onExpandedChange: controlledOnExpandedChange,
      defaultExpandedAll,
      allowsMultipleExpanded,
      ...props
    },
    ref,
  ) => {
    return null;
  },
);

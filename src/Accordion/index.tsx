"use client";
import { useButton, useDisclosure, mergeProps, useFocusRing } from "react-aria";
import { useDisclosureGroupState, useDisclosureState } from "react-stately";
import {
  useId,
  createContext,
  useContext,
  useRef,
  forwardRef,
  type ReactNode,
} from "react";
import type { Key } from "@react-types/shared";
import { Typography } from "../Typography";
import { MdArrowDropDown, MdArrowDropUp } from "../Icons";
import styles from "./index.module.css";

type Item = {
  id: string;
  title: string;
  content: ReactNode;
};

type DisclosureItemProps = Item & {
  isDisabled?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
};

const DisclosureGroupStateContext = createContext<ReturnType<
  typeof useDisclosureGroupState
> | null>(null);

const AccordionItem = forwardRef<HTMLDivElement, DisclosureItemProps>(
  (props, ref) => {
    const defaultId = useId();
    const id = props.id || defaultId;
    const groupState = useContext(DisclosureGroupStateContext);
    const isActuallyExpanded = groupState
      ? groupState.expandedKeys.has(id)
      : !!props.isExpanded;

    const state = useDisclosureState({
      ...props,
      isExpanded: isActuallyExpanded,
      onExpandedChange(isExpanded) {
        if (groupState) {
          groupState.toggleKey(id);
        }
        props.onExpandedChange?.(isExpanded);
      },
    });

    const panelRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const isDisabled = props.isDisabled || groupState?.isDisabled || false;

    const { buttonProps: triggerProps, panelProps } = useDisclosure(
      {
        ...props,
        isExpanded: state.isExpanded,
        isDisabled,
      },
      state,
      panelRef,
    );
    const { buttonProps } = useButton(triggerProps, triggerRef);
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <div className={styles.disclosure} ref={ref}>
        <button
          className={`${styles.trigger} ${styles.triggerHeading}`}
          ref={triggerRef}
          {...mergeProps(buttonProps, focusProps)}
          style={{
            outline: isFocusVisible ? "2px solid dodgerblue" : "none",
          }}
          aria-expanded={state.isExpanded}
          aria-controls={panelProps.id}
        >
          <Typography variant="titleSmall">{props.title}</Typography>
          {state.isExpanded ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </button>
        {state.isExpanded && (
          <div
            className={styles.panel}
            ref={panelRef}
            {...panelProps}
            data-state={state.isExpanded ? "open" : "closed"}
          >
            <Typography variant="bodyMedium">{props.content}</Typography>
          </div>
        )}
      </div>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

// Props の型定義を修正
type BaseAccordionProps = {
  isDisabled?: boolean;
  items: Item[];
  expandedKeys?: Iterable<Key>; // controlled
  onExpandedChange?: (keys: Set<Key>) => void;
};

type AccordionWithDefaultKeys = BaseAccordionProps & {
  defaultExpandedKeys: Iterable<Key>;
  defaultExpandedAll?: never;
  allowsMultipleExpanded?: true; // 暗黙的に true、もしくは指定させない
};

type AccordionWithDefaultAll = BaseAccordionProps & {
  defaultExpandedKeys?: never;
  defaultExpandedAll: boolean; // true の場合のみ意味がある
  allowsMultipleExpanded?: true; // 暗黙的に true、もしくは指定させない
};

type AccordionDefaultBehavior = BaseAccordionProps & {
  defaultExpandedKeys?: never;
  defaultExpandedAll?: never;
  allowsMultipleExpanded?: boolean; // ユーザーが指定可能
};

type Props =
  | AccordionWithDefaultKeys
  | AccordionWithDefaultAll
  | AccordionDefaultBehavior;

export const Accordion = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { items, ...rest } = props;
  let resolvedDefaultExpandedKeys = props.defaultExpandedKeys;
  let resolvedAllowsMultipleExpanded = props.allowsMultipleExpanded;

  if ("defaultExpandedAll" in props && props.defaultExpandedAll) {
    resolvedDefaultExpandedKeys = new Set(items.map((item) => item.id));
    resolvedAllowsMultipleExpanded = true;
  } else if ("defaultExpandedKeys" in props && props.defaultExpandedKeys) {
    resolvedAllowsMultipleExpanded = true;
  }

  const state = useDisclosureGroupState({
    ...(rest as BaseAccordionProps), // キャストして共通プロパティを渡す
    defaultExpandedKeys: resolvedDefaultExpandedKeys,
    allowsMultipleExpanded: resolvedAllowsMultipleExpanded,
    // defaultExpandedAll は上で解決済みなので渡さない
  });

  return (
    <div className={styles.accordion} ref={ref}>
      <DisclosureGroupStateContext.Provider value={state}>
        {items.map((item) => (
          <AccordionItem key={item.id} {...item} />
        ))}
      </DisclosureGroupStateContext.Provider>
    </div>
  );
});
Accordion.displayName = "Accordion";

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

/**
 * Defines the basic structure for an accordion item.
 */
type Item = {
  /**
   * A unique identifier for the item.
   */
  id: string;
  /**
   * The title of the item, displayed in the trigger.
   */
  title: string;
  /**
   * The content of the item, displayed when the item is expanded.
   */
  content: ReactNode;
};

/**
 * Props for an individual accordion item.
 * Extends {@link Item}.
 */
type ItemProps = Item & {
  /**
   * Whether the item is disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the item is expanded.
   * This is controlled by `expandedKeys` or `defaultExpandedKeys` in the `Accordion` component.
   */
  isExpanded?: boolean;
  /**
   * Callback fired when the item's expanded state changes.
   */
  onExpandedChange?: (isExpanded: boolean) => void;
};

/**
 * @internal
 * Context for managing the state of a group of disclosures (accordion items).
 */
const DisclosureGroupStateContext = createContext<ReturnType<
  typeof useDisclosureGroupState
> | null>(null);

/**
 * Represents an individual item within an Accordion.
 *
 * @example
 * ```tsx
 * <AccordionItem id="item1" title="Item 1" content="Content for item 1" />
 * ```
 */
const AccordionItem = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
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
    <div ref={ref}>
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
});
AccordionItem.displayName = "AccordionItem";

/**
 * Base props for the Accordion component.
 */
type BaseProps = {
  /**
   * Whether all accordion items are disabled.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * An array of items to render in the accordion.
   * See {@link Item}.
   */
  items: Item[];
  /**
   * The currently expanded keys in the accordion (controlled).
   */
  expandedKeys?: Iterable<Key>;
  /**
   * Callback fired when the expanded keys change.
   */
  onExpandedChange?: (keys: Set<Key>) => void;
};

/**
 * Props for Accordion when using `defaultExpandedKeys`.
 * Allows multiple items to be expanded by default.
 */
type AccordionWithDefaultKeys = BaseProps & {
  /**
   * The keys of the items that are expanded by default (uncontrolled).
   */
  defaultExpandedKeys: Iterable<Key>;
  /**
   * @deprecated Use `defaultExpandedKeys` with all item keys instead.
   */
  defaultExpandedAll?: never;
  /**
   * Whether multiple accordion items can be expanded simultaneously.
   * Implicitly true when `defaultExpandedKeys` is provided.
   * @default false (or true if defaultExpandedKeys is set)
   */
  allowsMultipleExpanded?: true;
};

/**
 * Props for Accordion when using `defaultExpandedAll`.
 * All items are expanded by default, and multiple expansions are allowed.
 */
type AccordionWithDefaultAll = BaseProps & {
  defaultExpandedKeys?: never;
  /**
   * Whether all accordion items are expanded by default (uncontrolled).
   * If true, `allowsMultipleExpanded` is also implicitly true.
   */
  defaultExpandedAll: boolean;
  /**
   * Whether multiple accordion items can be expanded simultaneously.
   * Implicitly true when `defaultExpandedAll` is true.
   * @default true (if defaultExpandedAll is true)
   */
  allowsMultipleExpanded?: true;
};

/**
 * Props for Accordion with default behavior (no specific default expansion, single or multiple allowed based on `allowsMultipleExpanded`).
 */
type AccordionDefaultBehavior = BaseProps & {
  defaultExpandedKeys?: never;
  defaultExpandedAll?: never;
  /**
   * Whether multiple accordion items can be expanded simultaneously.
   * @default false
   */
  allowsMultipleExpanded?: boolean;
};

/**
 * Props for the Accordion component.
 * This is a union of different ways to control the default expanded state.
 */
type Props =
  | AccordionWithDefaultKeys
  | AccordionWithDefaultAll
  | AccordionDefaultBehavior;

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', title: 'Section 1', content: 'Content for section 1' },
 *   { id: '2', title: 'Section 2', content: 'Content for section 2' },
 * ];
 *
 * <Accordion items={items} />
 *
 * <Accordion items={items} defaultExpandedKeys={['1']} />
 *
 * <Accordion items={items} defaultExpandedAll />
 *
 * <Accordion items={items} allowsMultipleExpanded />
 * ```
 */
export const Accordion = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { items, ...rest } = props;
  let resolvedDefaultExpandedKeys = props.defaultExpandedKeys;
  let resolvedAllowsMultipleExpanded = props.allowsMultipleExpanded;

  if ("defaultExpandedAll" in props && props.defaultExpandedAll) {
    resolvedDefaultExpandedKeys = new Set(items.map((item: Item) => item.id));
    resolvedAllowsMultipleExpanded = true;
  } else if ("defaultExpandedKeys" in props && props.defaultExpandedKeys) {
    resolvedAllowsMultipleExpanded = true;
  }

  const state = useDisclosureGroupState({
    ...(rest as BaseProps),
    defaultExpandedKeys: resolvedDefaultExpandedKeys,
    allowsMultipleExpanded: resolvedAllowsMultipleExpanded,
  });

  return (
    <div className={styles.accordion} ref={ref}>
      <DisclosureGroupStateContext.Provider value={state}>
        {items.map((item: Item) => (
          <AccordionItem key={item.id} {...item} />
        ))}
      </DisclosureGroupStateContext.Provider>
    </div>
  );
});
Accordion.displayName = "Accordion";

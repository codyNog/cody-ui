import type { ComponentProps, ReactNode } from "react";
import {
  Label as RACLabel,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  type RadioProps as RACRadioProps,
} from "react-aria-components";
import styles from "./index.module.css";

// --- RadioGroup ---

type RadioGroupProps = {
  /** Group label */
  label?: ReactNode;
  /** Additional CSS class */
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
} & Omit<RACRadioGroupProps, "className">; // Exclude RAC className

/**
 * RadioGroup component based on react-aria-components.
 * Groups multiple Radio components.
 */
export const RadioGroup = ({
  label,
  className,
  options,
  ...props
}: RadioGroupProps) => {
  return (
    <RACRadioGroup
      {...props}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {label && <RACLabel className={styles.groupLabel}>{label}</RACLabel>}
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RACRadioGroup>
  );
};

// --- Radio ---

type RadioProps = {
  /** Radio label */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
} & Omit<RACRadioProps, "className" | "children">; // Exclude RAC className and children

/**
 * Radio component based on react-aria-components.
 * Represents a single option within a RadioGroup.
 */
export const Radio = ({ children, className, ...props }: RadioProps) => {
  return (
    <RACRadio
      {...props}
      className={className ? `${styles.radio} ${className}` : styles.radio}
    >
      {/* Custom visual indicator */}
      <div className={styles.indicator} />
      {/* Label */}
      <RACLabel className={styles.radioLabel}>{children}</RACLabel>
      {/* Input is handled internally by RACRadio */}
    </RACRadio>
  );
};

// --- Prop Types for Storybook/External Use ---

/** Props for the RadioGroup component */
export type RadioGroupComponentProps = ComponentProps<typeof RadioGroup>;
/** Props for the Radio component */
export type RadioComponentProps = ComponentProps<typeof Radio>;

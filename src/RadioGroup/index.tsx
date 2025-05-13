import type { ReactNode } from "react";
import {
  Label as RACLabel,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps as RACRadioGroupProps,
  type RadioProps as RACRadioProps,
} from "react-aria-components";
import { Typography } from "../Typography";
import styles from "./index.module.css";

/**
 * Props for the RadioGroup component.
 */
type RadioGroupProps = {
  /** The label for the radio group. */
  label?: ReactNode;
  /** Additional CSS class name(s) to apply to the radio group. */
  className?: string;
  /** An array of options to render as radio buttons. */
  options: {
    /** The value of the radio option. */
    value: string;
    /** The label for the radio option. */
    label: string;
    /** Whether this specific radio button is disabled. */
    isDisabled?: boolean;
  }[];
} & Omit<RACRadioGroupProps, "className">;

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
      {label && (
        <RACLabel>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {label}
          </Typography>
        </RACLabel>
      )}
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          isDisabled={option.isDisabled} // Pass isDisabled from option data
        >
          {option.label}
        </Radio>
      ))}
    </RACRadioGroup>
  );
};

/**
 * Props for the Radio component.
 */
type RadioProps = {
  /** The content to be displayed as the radio button's label. */
  children: ReactNode;
  /** Additional CSS class name(s) to apply to the radio button. */
  className?: string;
} & Omit<RACRadioProps, "className" | "children">;

/**
 * Radio component based on react-aria-components.
 * Represents a single option within a RadioGroup.
 */
const Radio = ({ children, className, ...props }: RadioProps) => {
  return (
    <RACRadio
      {...props}
      className={className ? `${styles.radio} ${className}` : styles.radio}
    >
      <div className={styles.indicator} />
      <RACLabel>
        <Typography variant="bodyLarge" color="onSurface">
          {children}
        </Typography>
      </RACLabel>
    </RACRadio>
  );
};

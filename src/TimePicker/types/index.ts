import type { ComponentProps } from "react";
import type { TimeValue } from "react-aria-components";
import type { TextField } from "../../TextField";

export type Props = {
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  value?: TimeValue | null;
  onChange?: (value: TimeValue) => void;
  /**
   * The granularity of the time field.
   * @default "minute"
   */
  granularity?: "hour" | "minute";
  variant?: ComponentProps<typeof TextField>["variant"];
};

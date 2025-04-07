export type DatePickerType = "single" | "range" | "multiple";

// Make this type exported so it can be used directly when needed
export type DatePickerValue<T extends DatePickerType> = T extends "single"
  ? Date
  : Date[];

export type Props<T extends DatePickerType> = {
  variant: "docked" | "modal";
  type: T;
  value?: DatePickerValue<T>;
  defaultValue?: DatePickerValue<T>;
  onChange?: (value: DatePickerValue<T>) => void;
  /**
   * ラベル
   */
  label?: string;
  /**
   * 説明文
   */
  description?: string;
  /**
   * テキストフィールドのスタイル種別
   * @default 'filled'
   */
  textFieldVariant?: "outlined" | "filled";
  isDisabled?: boolean;
  errorMessage?: string;
  required?: boolean;
};

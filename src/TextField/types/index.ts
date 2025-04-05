import type { TextFieldProps as AriaTextFieldProps, ValidationResult } from "react-aria-components";

// テキストフィールドのスタイル種別 (Filled or Outlined)
// Props 型定義内でのみ使用するため export しない
type TextFieldVariant = "filled" | "outlined";

// react-aria-components の TextFieldProps から共通で除外・使用するものを定義
// (このファイル内でのみ使用するため export しない)
type BaseTextFieldProps = Omit<
  AriaTextFieldProps,
  "className" | "style" | "children"
>;

/**
 * TextField ラッパーおよび各バリアントコンポーネントで共通で使用する Props
 */
export type Props = BaseTextFieldProps & {
  /**
   * ラベル
   */
  label?: string;
  /**
   * 説明文
   */
  description?: string;
  /**
   * エラーメッセージ (ValidationResult | string)
   */
  errorMessage?: ValidationResult | string;
  /**
   * 複数行入力にするか
   * @default false
   */
  multiline?: boolean;
  /**
   * テキストフィールドのスタイル種別
   * ラッパーコンポーネントで使用
   * @default 'filled'
   */
  variant?: TextFieldVariant; // export しない TextFieldVariant を使用
};

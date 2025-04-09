import type { ReactNode } from "react"; // ReactNode を named import
import type {
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";

// テキストフィールドのスタイル種別 (Filled or Outlined)
// Props 型定義内でのみ使用するため export しない
type TextFieldVariant = "filled" | "outlined";

// react-aria-components の TextFieldProps から共通で除外・使用するものを定義
// (このファイル内でのみ使用するため export しない)
type BaseTextFieldProps = Omit<
  AriaTextFieldProps,
  "className" | "style" | "children" | "onChange"
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
   * multiline 時の最大表示行数
   * これを超えるとスクロールバーが表示される
   */
  maxLines?: number;
  /**
   * テキストフィールドのスタイル種別
   * ラッパーコンポーネントで使用
   * @default 'filled'
   */
  variant?: TextFieldVariant; // export しない TextFieldVariant を使用
  /**
   * 入力フィールドの前に表示する要素 (アイコン、テキストなど)
   * @example <UserIcon /> or '$'
   */
  startAdornment?: ReactNode; // React. を削除
  /**
   * 入力フィールドの後に表示する要素 (アイコン、テキストなど)
   * @example <PasswordVisibilityToggle /> or 'kg'
   */
  endAdornment?: ReactNode; // React. を削除
  /**
   * 必須項目かどうか
   * @default false
   */
  required?: boolean;
  onChangeText?: (text: string) => void;
};

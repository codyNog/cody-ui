"use client";
import { forwardRef } from "react";

/**
 * プログレスインジケーターの基本的な Props です。
 */
type ProgressIndicatorBaseProps = {
  /**
   * プログレスインジケーターの種類を指定します。
   * - `linear`: 線形プログレスインジケーター
   * - `circular`: 円形プログレスインジケーター
   */
  variant: "linear" | "circular";
  /**
   * プログレスインジケーターのサイズを指定します。
   * 省略した場合、デフォルトのサイズが適用されます。
   */
  size?: "small" | "medium" | "large";
  /**
   * スクリーンリーダーが読み上げるためのアクセシビリティラベルです。
   */
  ariaLabel?: string;
  // TODO: className や style など、他の共通 Props も検討する
};

/**
 * 確定的な進捗を示すプログレスインジケーターの Props です。
 * (進捗状況が具体的な数値で示される場合)
 */
type DeterminateProgressIndicatorProps = ProgressIndicatorBaseProps & {
  /**
   * プログレスインジケーターが不確定状態でないことを示します。
   * 通常は `false` または未指定です。
   */
  indeterminate?: false;
  /**
   * 現在の進捗度を 0 から 100 の数値で指定します。
   */
  value: number;
  /**
   * `value` が指定されている場合に、スクリーンリーダーが読み上げる進捗状況のテキストです。
   * 例: "50%完了"
   */
  ariaValueText?: string;
};

/**
 * 不確定な進捗を示すプログレスインジケーターの Props です。
 * (進捗状況が不明で、動作中であることを示す場合)
 */
type IndeterminateProgressIndicatorProps = ProgressIndicatorBaseProps & {
  /**
   * プログレスインジケーターが不確定状態であることを示します。
   */
  indeterminate: true;
  /**
   * 不確定状態の場合、`value` は指定できません。
   */
  value?: never;
  /**
   * 円形の不確定プログレスインジケーターの場合に、4色のローテーションアニメーションを使用するかどうかを指定します。
   * Material Design 3 の仕様に準拠します。
   */
  fourColor?: boolean;
  /**
   * 不確定状態の場合、`ariaValueText` は指定できません。
   */
  ariaValueText?: never;
};

/**
 * プログレスインジケーターコンポーネントの Props です。
 * {@link DeterminateProgressIndicatorProps} または {@link IndeterminateProgressIndicatorProps} のいずれかの型を取ります。
 */
export type ProgressIndicatorProps =
  | DeterminateProgressIndicatorProps
  | IndeterminateProgressIndicatorProps;

/**
 * ProgressIndicator コンポーネントは、タスクの進捗状況を視覚的に示します。
 * 線形または円形のスタイル、確定的または不確定的な状態をサポートします。
 */
export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>((_props, ref) => {
  return <div ref={ref}>ProgressIndicator</div>;
});

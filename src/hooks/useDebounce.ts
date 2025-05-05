import { useEffect, useState } from "react";

/**
 * 値の更新を遅延させるカスタムフック (デバウンス)
 * @param value デバウンス対象の値
 * @param delay 遅延時間 (ミリ秒)。デフォルトは 500ms。
 * @returns 遅延された値
 */
export function useDebounce<T>(value: T, delay = 500): T {
  // 型注釈 : number を削除
  // デバウンスされた値を保持する state
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay ミリ秒後に値を更新するタイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数: value または delay が変更された時にタイマーをクリア
    // これにより、指定時間内に入力が続いた場合はタイマーがリセットされる
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value または delay が変更された時だけ実行

  return debouncedValue;
}

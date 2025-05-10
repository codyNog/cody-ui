"use client";
import { type ReactElement, forwardRef, useRef } from "react"; // useRef をインポート
import {
  type PressEvent, // PressEvent もインポート
  ToggleButton,
  type ToggleButtonProps,
} from "react-aria-components";
import styles from "./index.module.css";

type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

// onPress の型を変更: (newSelectedState: boolean, pressEvent: PressEvent) => void
type Props = {
  variant?: IconButtonVariant;
  // isSelected は ToggleButtonProps に含まれる
  // onChange も ToggleButtonProps に含まれる (状態管理のために親が必要な場合)
  /**
   * ボタンが押されたときの処理だよ。
   * 第1引数にトグル後の選択状態、第2引数にプレスイベントが渡るよ。
   */
  onClick?: (newSelectedState: boolean, pressEvent: PressEvent) => void; // onPress を onClick に変更
  icon: ReactElement;
} & Omit<ToggleButtonProps, "children" | "onPress" | "onClick">; // ToggleButtonProps の onPress は使わないので Omit

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      icon,
      className,
      variant = "standard",
      isSelected, // isSelected は Props から受け取る
      onClick: propsOnClick, // onPress を onClick に、propsOnPress を propsOnClick に変更
      onChange: propsOnChange, // Props で受け取る onChange (親が状態管理する場合)
      ...otherProps // isDisabled などが含まれる
    },
    ref,
  ) => {
    // プレスイベントを一時的に保存するための ref だよ
    const pressEventRef = useRef<PressEvent | null>(null);

    const handlePress = (e: PressEvent) => {
      // 押されたときのイベントを保存しておく
      pressEventRef.current = e;
      // ここではまだ propsOnClick は呼ばないよ
    };

    const handleChange = (newlySelected: boolean) => {
      // まず、親コンポーネントに状態変更を通知する (もし propsOnChange があれば)
      propsOnChange?.(newlySelected);

      // 次に、保存しておいたプレスイベントと一緒に、新しい選択状態を propsOnClick で通知する
      if (propsOnClick && pressEventRef.current) {
        propsOnClick(newlySelected, pressEventRef.current); // propsOnPress を propsOnClick に変更
      }
      // 使ったらクリアしておく
      pressEventRef.current = null;
    };

    return (
      <ToggleButton
        {...otherProps} // isDisabled など
        ref={ref}
        isSelected={isSelected} // 親から渡された isSelected を使う
        onPress={handlePress} // まず handlePress が呼ばれる
        onChange={handleChange} // 次に handleChange が呼ばれて、ここで propsOnPress を実行
        className={[
          styles.iconButton,
          variant !== "standard" ? styles[variant] : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles.iconContainer}>{icon}</span>
      </ToggleButton>
    );
  },
);

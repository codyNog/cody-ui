import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react"; // useEffect は不要になったので削除
import { TextField } from "../TextField";
import { useDebounce } from "../hooks/useDebounce"; // 作成したフックをインポート
import * as Icons from "./index";

const meta: Meta = {
  title: "Foundation/Icons",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    // TextField の入力値を保持する state
    const [inputValue, setInputValue] = useState("");
    // inputValue をデバウンスした値を取得 (300ms 遅延)
    const debouncedInputValue = useDebounce(inputValue, 300);

    // デバウンスされた値を使ってアイコンをフィルタリング
    const filteredIcons = Object.entries(Icons).filter(([name]) =>
      name.toLowerCase().includes(debouncedInputValue.toLowerCase()),
    );

    // useEffect を使ったデバウンス処理は削除

    return (
      <div>
        <div style={{ marginBottom: "1rem", width: "300px" }}>
          <TextField
            label="Search Icons"
            // value と onChangeText は inputValue を使う
            value={inputValue}
            onChangeText={setInputValue}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {filteredIcons.map(([name, IconComponent]) => (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                border: "1px solid var(--md-sys-color-outline-variant)",
                padding: "1rem",
                borderRadius: "8px",
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              <IconComponent style={{ width: 24, height: 24 }} />
              <span style={{ fontSize: "0.8rem" }}>{name}</span>
            </div>
          ))}
          {/* 検索結果がない場合の表示 (デバウンスされた値で判定) */}
          {filteredIcons.length === 0 && debouncedInputValue && (
            <p>No icons found matching "{debouncedInputValue}"</p>
          )}
        </div>
      </div>
    );
  },
};

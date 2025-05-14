import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react"; // ComponentProps をインポート
import { Select as Component } from "."; // SelectProps のインポートを削除
import { MdInfo } from "../Icons";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    label: "Label", // label と options は meta.args に残す
    options: Array.from({ length: 20 }, (_, i) => ({
      // 20個のオプションを生成
      label: `Option ${i + 1}`,
      value: `${i + 1}`,
    })),
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

// ComponentProps を使用して型を取得
type Props = ComponentProps<typeof Component>;

// Storybook の render 関数内で状態を管理するためのヘルパーコンポーネント
const InteractiveSelect = (
  // Omit を使って value と onChange を除外し、initialValue を追加
  props: Omit<Props, "value" | "onChange"> & {
    initialValue?: string | number;
  },
) => {
  const [value, setValue] = useState<string | number | undefined>(
    props.initialValue,
  );
  return (
    <Component
      // {...props} を先に展開し、value と onChange を上書きする
      {...props}
      value={value}
      onChange={(val) => {
        setValue(val);
        // Storybook の Actions パネルにログを出したい場合は、
        // meta.argTypes で onChange を定義し、props.onChange を呼び出す
        // (props as any).onChange?.(val); // もし args に onChange があれば呼び出す
        console.log("onChange", val);
      }}
    />
  );
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* 通常 */}
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <InteractiveSelect
          {...args} // args には label と options が含まれる
          variant="filled"
          initialValue="1"
        />
        <InteractiveSelect {...args} variant="outlined" initialValue="1" />
      </div>
      {/* Disabled */}
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <InteractiveSelect
          {...args}
          variant="filled"
          disabled
          initialValue="1"
        />
        <InteractiveSelect
          {...args}
          variant="outlined"
          disabled
          initialValue="1"
        />
      </div>
      {/* ErrorMessage */}
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <InteractiveSelect
          {...args}
          variant="filled"
          errorMessage="Error message"
          initialValue="1"
        />
        <InteractiveSelect
          {...args}
          variant="outlined"
          errorMessage="Error message"
          initialValue="1"
        />
      </div>
      {/* SupportingText */}
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <InteractiveSelect
          {...args}
          variant="filled"
          supportingText="Supporting text"
          initialValue="1"
        />
        <InteractiveSelect
          {...args}
          variant="outlined"
          supportingText="Supporting text"
          initialValue="1"
        />
      </div>
      {/* LeadingIcon */}
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <InteractiveSelect
          {...args}
          variant="filled"
          leadingIcon={<MdInfo />}
          initialValue="1"
        />
        <InteractiveSelect
          {...args}
          variant="outlined"
          leadingIcon={<MdInfo />}
          initialValue="1"
        />
      </div>
    </div>
  ),
};

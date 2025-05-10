import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "."; // 作成した Button コンポーネントをインポート

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "text", "elevated", "tonal"],
      description: "ボタンのスタイル種別",
      defaultValue: "filled",
    },
    isDisabled: {
      control: "boolean",
      description: "非活性状態にするか",
      defaultValue: false,
    },
    icon: {
      control: "boolean", // 簡単な切り替えのため boolean にする (実際は Node を渡す)
      description: "左側にアイコンを表示するか (例として boolean)",
    },
    trailingIcon: {
      control: "boolean", // 簡単な切り替えのため boolean にする (実際は Node を渡す)
      description: "右側にアイコンを表示するか (例として boolean)",
    },
    children: {
      control: "text",
      description: "ボタンのラベルテキスト",
      defaultValue: "Button",
    },
    onClick: {
      action: "clicked", // "pressed" から "clicked" に変更
      description: "ボタンがクリックされたときのイベント", // 説明も変更
    },
  },
  args: { onClick: fn() }, // onPress を onClick に変更
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Filled: Story = {
  args: {
    variant: "filled",
    children: "Filled Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Outlined Button",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    children: "Text Button",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: "Elevated Button",
  },
};

export const Tonal: Story = {
  args: {
    variant: "tonal",
    children: "Tonal Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "filled",
    children: "Disabled Button",
    isDisabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "."; // 作成した Button コンポーネントをインポート
// import { Plus } from "@tamagui/lucide-icons"; // アイコン使うならインポート

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
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
      // control: { type: 'object' }, // 実際に Node を渡す場合はこちら
    },
    trailingIcon: {
      control: "boolean", // 簡単な切り替えのため boolean にする (実際は Node を渡す)
      description: "右側にアイコンを表示するか (例として boolean)",
      // control: { type: 'object' }, // 実際に Node を渡す場合はこちら
    },
    children: {
      control: "text",
      description: "ボタンのラベルテキスト",
      defaultValue: "Button",
    },
    onPress: {
      action: "pressed",
      description: "ボタンが押されたときのイベント",
    },
    // 他の react-aria-components の Props も必要に応じて追加
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onPress: fn() },
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

// export const WithIcon: Story = {
//   args: {
//     variant: "filled",
//     children: "Button with Icon",
//     icon: <Plus size={18} />, // アイコンコンポーネントを指定
//   },
// };

// export const WithTrailingIcon: Story = {
//   args: {
//     variant: "filled",
//     children: "Button with Trailing Icon",
//     trailingIcon: <Plus size={18} />, // アイコンコンポーネントを指定
//   },
// };

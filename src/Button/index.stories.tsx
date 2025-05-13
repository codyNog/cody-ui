import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { MdFavorite } from "../Icons";
import { Button } from ".";

const meta = {
  component: Button,
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
      control: "boolean",
      description: "左側にアイコンを表示するか (例として boolean)",
    },
    children: {
      control: "text",
      description: "ボタンのラベルテキスト",
      defaultValue: "Button",
    },
    onClick: {
      action: "clicked",
      description: "ボタンがクリックされたときのイベント",
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const WithIcon: Story = {
  args: {
    variant: "filled",
    children: "Icon Button",
    icon: <MdFavorite />,
  },
};

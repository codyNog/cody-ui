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
      description: "The visual style of the button.",
      defaultValue: "filled",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the button is disabled.",
      defaultValue: false,
    },
    icon: {
      control: "boolean",
      description:
        "Whether to display an icon on the left side (example uses boolean for control).",
    },
    children: {
      control: "text",
      description: "The label text of the button.",
      defaultValue: "Button",
    },
    onClick: {
      action: "clicked",
      description: "Event handler for when the button is clicked.",
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

import type { Key } from "@react-types/shared";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { useState } from "react";
import { Accordion as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    items: [
      { id: "1", title: "Section 1", content: "Content for section 1" },
      { id: "2", title: "Section 2", content: "Content for section 2" },
      { id: "3", title: "Section 3", content: "Content for section 3" },
    ],
    onExpandedChange: action("onExpandedChange"),
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    defaultExpandedKeys: new Set(["1"]),
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(["2"]));
    return (
      <Component
        {...args}
        expandedKeys={expandedKeys}
        onExpandedChange={(keys: Set<Key>) => {
          setExpandedKeys(keys);
          args.onExpandedChange?.(keys);
        }}
      />
    );
  },
  args: {},
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultExpandedKeys: new Set(["1"]),
  },
};

export const DefaultExpandedAll: Story = {
  args: {
    defaultExpandedAll: true,
  },
};

export const Behavior: Story = {
  args: {
    items: [
      { id: "b1", title: "Behavior Section 1", content: "Behavior content 1" },
      { id: "b2", title: "Behavior Section 2", content: "Behavior content 2" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas.getByText("Behavior Section 1")).toBeInTheDocument();
    expect(canvas.getByText("Behavior Section 2")).toBeInTheDocument();
  },
};

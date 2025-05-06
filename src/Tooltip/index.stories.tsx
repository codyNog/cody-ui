import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Tooltip as Component } from ".";
import { getCanvas } from "../libs/storybook";
import { Button } from "../Button";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {};

export const Default: Story = {
  args,
  render: (args) => (
    <div style={{ display: "flex", gap: "16px" }}>
      <Component content="Edit" variant="plain">
        <Button>Edit</Button>
      </Component>
      <Component
        title="Edit"
        content="Edit"
        variant="rich"
        actions={[{ label: "Edit", onPress: () => {} }]}
      >
        <Button>Edit</Button>
      </Component>
    </div>
  ),
};

export const Behavior: Story = {
  args,
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

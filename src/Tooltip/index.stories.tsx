import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Tooltip as Component } from ".";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { TextField } from "../TextField";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const args: Story["args"] = {};

export const Default: Story = {
  args,
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <Component content="Edit" variant="plain">
        <Button>Edit</Button>
      </Component>
      <Component
        title="Edit"
        content="Edit"
        variant="rich"
        actions={[{ label: "Edit", onClick: () => {} }]} // onPress を onClick に変更
      >
        <Button>Edit</Button>
      </Component>
      <Component
        title="Edit"
        content={<TextField />}
        variant="rich"
        actions={[{ label: "Edit", onClick: () => {} }]} // onPress を onClick に変更
      >
        <Chip>chip</Chip>
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

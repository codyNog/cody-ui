import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { MdAdd } from "react-icons/md";
import { Fab as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    icon: <MdAdd />,
    "aria-label": "Create",
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: "small",
    "aria-label": "Create small",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    "aria-label": "Create large",
  },
};

export const Extended: Story = {
  args: {
    variant: "extended",
    label: "Create",
    // aria-label will be taken from label if not provided for extended
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <Component icon={<MdAdd />} size="small" aria-label="Small FAB" />
      <Component
        icon={<MdAdd />}
        variant="standard"
        aria-label="Standard FAB"
      />
      <Component icon={<MdAdd />} size="large" aria-label="Large FAB" />
      <Component icon={<MdAdd />} variant="extended" label="Extended FAB" />
    </div>
  ),
};

export const Behavior: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
    // TODO: Add more interaction tests
  },
};

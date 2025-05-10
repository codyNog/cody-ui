import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { ProgressIndicator as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

const baseArgs = {
  ariaLabel: "Progress",
};

export const Default: Story = {
  args: {
    ...baseArgs,
    variant: "linear",
    value: 50,
  },
  render: (args) => <Component {...args} />,
};

export const Linear: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p>Determinate</p>
        <Component
          {...baseArgs}
          variant="linear"
          value={50}
          indeterminate={false}
        />
      </div>
      <div>
        <p>Indeterminate</p>
        <Component {...baseArgs} variant="linear" indeterminate />
      </div>
    </div>
  ),
};

export const Circular: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p>Determinate</p>
        <Component
          {...baseArgs}
          variant="circular"
          value={50}
          indeterminate={false}
        />
      </div>
      <div>
        <p>Indeterminate</p>
        <Component {...baseArgs} variant="circular" indeterminate />
      </div>
      <div>
        <p>Indeterminate (Four Color)</p>
        <Component {...baseArgs} variant="circular" indeterminate fourColor />
      </div>
    </div>
  ),
};

export const Behavior: Story = {
  args: {
    ...baseArgs,
    variant: "linear",
    value: 50,
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

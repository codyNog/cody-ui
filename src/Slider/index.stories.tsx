import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Slider as Component } from ".";
import { getCanvas } from "../libs/storybook";
import { useState } from "react";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    value: { control: "object" }, // range slider のために object も許容
    onChange: { action: "changed" },
    minValue: { control: "number" },
    maxValue: { control: "number" },
    step: { control: "number" },
    isDisabled: { control: "boolean" },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    label: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const InteractiveSlider = (args: Story["args"]) => {
  const [value, setValue] = useState(args?.value ?? 50);
  return <Component {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    label: "Volume",
    value: 50, // 初期値
    isDisabled: false,
    orientation: "horizontal",
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const Continuous: Story = {
  args: {
    label: "Continuous Volume",
    minValue: 0,
    maxValue: 100,
    // step: undefined, // step を指定しないことで continuous になる
    value: 30,
    isDisabled: false,
    orientation: "horizontal",
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    label: "Disabled Volume",
    isDisabled: true,
    value: 30,
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const Vertical: Story = {
  args: {
    ...Default.args,
    label: "Vertical Slider",
    orientation: "vertical",
    value: 70,
  },
  render: (args) => (
    <div style={{ height: "200px", display: "flex", justifyContent: "center" }}>
      <InteractiveSlider {...args} />
    </div>
  ),
};

export const RangeSlider: Story = {
  args: {
    label: "Price Range",
    minValue: 0,
    maxValue: 1000,
    value: [200, 800], // Range slider の初期値
    isDisabled: false,
    orientation: "horizontal",
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const DiscreteWithTicks: Story = {
  args: {
    label: "Discrete Slider",
    minValue: 0,
    maxValue: 100,
    step: 10,
    value: 60,
    isDisabled: false,
    orientation: "horizontal",
  },
  render: (args) => <InteractiveSlider {...args} />,
};

export const Behavior: Story = {
  args: Default.args,
  render: (args) => <InteractiveSlider {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    // TODO: Add interaction tests
    expect(canvas.getByRole("slider")).toBeInTheDocument();
  },
};

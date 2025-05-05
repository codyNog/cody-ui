import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./index";

const meta = {
  component: Checkbox,
  argTypes: {
    isSelected: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
    isDisabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    // Default args for controls
    isSelected: false,
    isIndeterminate: false,
    isDisabled: false,
    children: "Label",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Individual Stories ---

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Checked: Story = {
  args: {
    children: "Checked",
    isSelected: true,
  },
};

export const Indeterminate: Story = {
  args: {
    children: "Indeterminate",
    isIndeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    isDisabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    children: "Disabled Checked",
    isSelected: true,
    isDisabled: true,
  },
};

export const DisabledIndeterminate: Story = {
  args: {
    children: "Disabled Indeterminate",
    isIndeterminate: true,
    isDisabled: true,
  },
};

// --- Interactive Story ---

export const Interactive: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState(
      args.isSelected ?? args.defaultSelected ?? false,
    );
    const [indeterminate, setIndeterminate] = useState(
      args.isIndeterminate ?? false,
    );

    const handleChange = (newSelected: boolean) => {
      setSelected(newSelected);
      setIndeterminate(false);
      args.onChangeChecked?.(newSelected);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <Checkbox
          {...args}
          isSelected={selected}
          isIndeterminate={indeterminate}
          onChangeChecked={handleChange}
        >
          {args.children ?? "Interactive Checkbox"}
        </Checkbox>
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          Current state: isSelected={String(selected)}, isIndeterminate=
          {String(indeterminate)}
        </div>
        <button
          type="button"
          onClick={() => setIndeterminate(!indeterminate)}
          style={{ marginTop: "5px" }}
        >
          Toggle Indeterminate (External)
        </button>
      </div>
    );
  },
  args: {
    isDisabled: false,
    children: "Click Me!",
  },
};

// --- All States Story ---

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Checkbox
          {...args}
          isSelected={false}
          isIndeterminate={false}
          isDisabled={false}
        >
          Enabled
        </Checkbox>
        <Checkbox
          {...args}
          isSelected={true}
          isIndeterminate={false}
          isDisabled={false}
        >
          Checked
        </Checkbox>
        <Checkbox
          {...args}
          isSelected={false}
          isIndeterminate={true}
          isDisabled={false}
        >
          Indeterminate
        </Checkbox>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Checkbox
          {...args}
          isSelected={false}
          isIndeterminate={false}
          isDisabled={true}
        >
          Disabled
        </Checkbox>
        <Checkbox
          {...args}
          isSelected={true}
          isIndeterminate={false}
          isDisabled={true}
        >
          Disabled Checked
        </Checkbox>
        <Checkbox
          {...args}
          isSelected={false}
          isIndeterminate={true}
          isDisabled={true}
        >
          Disabled Indeterminate
        </Checkbox>
      </div>
    </div>
  ),
  parameters: {
    controls: { include: [] }, // Hide controls for this composite story
  },
};

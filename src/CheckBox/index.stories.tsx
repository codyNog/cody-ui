import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./index";

const meta = {
  component: Checkbox,
  argTypes: {
    checked: { control: "select", options: [true, false, "indeterminate"] },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    checked: false,
    disabled: false,
    label: "Checkbox Label",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Individual Stories ---

export const Default: Story = {
  args: {
    label: "Default Checkbox",
  },
};

export const CheckedStory: Story = {
  args: {
    checked: true,
    label: "Checked Checkbox",
  },
};

export const IndeterminateStory: Story = {
  args: {
    checked: "indeterminate",
    label: "Indeterminate Checkbox",
  },
};

export const DisabledStory: Story = {
  args: {
    disabled: true,
    label: "Disabled Checkbox",
  },
};

export const DisabledCheckedStory: Story = {
  args: {
    checked: true,
    disabled: true,
    label: "Disabled Checked",
  },
};

export const DisabledIndeterminateStory: Story = {
  args: {
    checked: "indeterminate",
    disabled: true,
    label: "Disabled Indeterminate",
  },
};

// --- Interactive Story ---

export const Interactive: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState<boolean | "indeterminate">(
      args.checked ?? false,
    );

    const handleChange = (newSelected: boolean) => {
      setChecked(newSelected);
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
        <Checkbox {...args} checked={checked} onChangeChecked={handleChange} />
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          Current state: checked={String(checked)}
        </div>
        <button
          type="button"
          onClick={() =>
            setChecked(checked === "indeterminate" ? false : "indeterminate")
          }
          style={{ marginTop: "5px" }}
        >
          Toggle Indeterminate (External)
        </button>
      </div>
    );
  },
  args: {
    disabled: false,
    label: "Interactive Checkbox",
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
        <Checkbox {...args} checked={false} disabled={false} label="Enabled" />
        <Checkbox {...args} checked={true} disabled={false} label="Checked" />
        <Checkbox
          {...args}
          checked={"indeterminate"}
          disabled={false}
          label="Indeterminate"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Checkbox {...args} checked={false} disabled={true} label="Disabled" />
        <Checkbox
          {...args}
          checked={true}
          disabled={true}
          label="Disabled Checked"
        />
        <Checkbox
          {...args}
          checked={"indeterminate"}
          disabled={true}
          label="Disabled Indeterminate"
        />
      </div>
    </div>
  ),
  parameters: {
    controls: { include: [] },
  },
  args: {
    label: undefined,
  },
};

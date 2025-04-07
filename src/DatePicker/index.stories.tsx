import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { DatePicker as Component } from ".";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    // Add action logger for onChange
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

// --- Single Type Story ---
export const SingleType: Story = {
  render: () => {
    // Define correctly typed onChange handler
    const handleChange = (value: Date) => {
      console.log("Single Date changed:", value);
    };

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        {/* Filled */}
        <Component
          label="Filled Single"
          variant="docked"
          type="single"
          defaultValue={new Date(2024, 6, 15)}
          onChange={handleChange}
          textFieldVariant="filled"
        />
        {/* Outlined */}
        <Component
          label="Outlined Single"
          variant="docked"
          type="single"
          defaultValue={new Date(2024, 6, 15)}
          onChange={handleChange}
          textFieldVariant="outlined"
        />
      </div>
    );
  },
};

// --- Range Type Story ---
export const RangeType: Story = {
  render: () => {
    // Define correctly typed onChange handler
    const handleChange = (value: Date[]) => {
      console.log("Range Date changed:", value);
    };

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        {/* Filled */}
        <Component
          label="Filled Range"
          variant="docked"
          type="range"
          defaultValue={[new Date(2024, 6, 10), new Date(2024, 6, 20)]}
          onChange={handleChange}
          textFieldVariant="filled"
        />
        {/* Outlined */}
        <Component
          label="Outlined Range"
          variant="docked"
          type="range"
          defaultValue={[new Date(2024, 6, 10), new Date(2024, 6, 20)]}
          onChange={handleChange}
          textFieldVariant="outlined"
        />
      </div>
    );
  },
};

// --- Multiple Type Story ---
export const MultipleType: Story = {
  render: () => {
    // Define correctly typed onChange handler
    const handleChange = (value: Date[]) => {
      console.log("Multiple Date changed:", value);
    };

    // Define defaultValue here for clarity
    const defaultValue = [
      new Date(2024, 6, 5),
      new Date(2024, 6, 15),
      new Date(2024, 6, 25),
    ];

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        {/* Filled */}
        <Component
          label="Filled Multiple"
          variant="docked"
          type="multiple"
          defaultValue={defaultValue}
          onChange={handleChange}
          textFieldVariant="filled"
        />
        {/* Outlined */}
        <Component
          label="Outlined Multiple"
          variant="docked"
          type="multiple"
          defaultValue={defaultValue}
          onChange={handleChange}
          textFieldVariant="outlined"
        />
      </div>
    );
  },
};

// --- Modal Variant Story ---
export const ModalVariant: Story = {
  render: () => {
    // Define correctly typed onChange handler
    const handleChange = (value: Date) => {
      console.log("Modal Date changed:", value);
    };

    return (
      <Component
        label="Modal Single Date"
        variant="modal"
        type="single"
        defaultValue={new Date(2024, 6, 15)}
        onChange={handleChange}
      />
    );
  },
};

// --- Behavior Story (using single type for simplicity) ---
export const Behavior: Story = {
  render: () => {
    // Define correctly typed onChange handler
    const handleChange = (value: Date) => {
      console.log("Behavior Date changed:", value);
    };

    return (
      <Component
        label="Single Date"
        variant="docked"
        type="single"
        defaultValue={new Date(2024, 6, 15)}
        onChange={handleChange}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    // Basic check, more specific interactions can be added
    expect(canvas.getByLabelText("Single Date")).toBeInTheDocument();
  },
};

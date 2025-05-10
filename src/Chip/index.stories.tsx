import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type { ComponentProps } from "react"; // Use type import
import { Chip as Component } from ".";
import {
  MdArrowDropDown,
  MdClose,
  MdLightbulbOutline,
  MdPerson,
} from "../Icons"; // Import necessary icons
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  // args/argTypes はストーリーごとに設定するため、meta では最小限に
};

export default meta;

// Helper function to render chips with labels
const renderChipWithLabel = (
  label: string,
  props: ComponentProps<typeof Component>, // Use ComponentProps directly
) => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <Component {...props} />
    <span style={{ fontSize: "12px", marginTop: "4px" }}>{label}</span>
  </div>
);

type Story = StoryObj<typeof Component>; // 型を typeof Component に戻す

// デフォルト表示のストーリー (assist)
export const Default: Story = {
  args: {
    variant: "assist", // Default variant
    children: "Chip Label", // Add default children
    isDisabled: false,
  },
  render: (args) => <Component {...args} />,
};

// --- Variants Story ---
export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      {renderChipWithLabel("Assist", {
        variant: "assist",
        children: "Assist",
        leadingIcon: <MdPerson />,
      })}
      {renderChipWithLabel("Filter (Unselected)", {
        variant: "filter",
        children: "Filter",
        trailingIcon: <MdArrowDropDown />,
      })}
      {renderChipWithLabel("Filter (Selected)", {
        variant: "filter",
        children: "Filter",
        isSelected: true,
        // leadingIcon is automatically MdCheck
      })}
      {renderChipWithLabel("Input", {
        variant: "input",
        children: "Input",
        leadingIcon: <MdPerson />,
        trailingIcon: <MdClose />,
      })}
      {renderChipWithLabel("Suggestion", {
        variant: "suggestion",
        children: "Suggestion",
      })}
    </div>
  ),
};

// --- Disabled Story ---
export const Disabled: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      {renderChipWithLabel("Assist", {
        variant: "assist",
        children: "Assist",
        leadingIcon: <MdPerson />,
        isDisabled: true,
      })}
      {renderChipWithLabel("Filter (Unselected)", {
        variant: "filter",
        children: "Filter",
        trailingIcon: <MdArrowDropDown />,
        isDisabled: true,
      })}
      {renderChipWithLabel("Filter (Selected)", {
        variant: "filter",
        children: "Filter",
        isSelected: true,
        isDisabled: true,
      })}
      {renderChipWithLabel("Input", {
        variant: "input",
        children: "Input",
        leadingIcon: <MdPerson />,
        trailingIcon: <MdClose />,
        isDisabled: true,
      })}
      {renderChipWithLabel("Suggestion", {
        variant: "suggestion",
        children: "Suggestion",
        leadingIcon: <MdLightbulbOutline />,
        isDisabled: true,
      })}
    </div>
  ),
};

// --- Behavior Story (Example with onPress) ---
export const Behavior: Story = {
  args: {
    variant: "input", // Example: Input chip
    children: "Click or Remove",
    leadingIcon: <MdPerson />,
    trailingIcon: <MdClose />,
    onClick: () => alert("Chip clicked!"), // onPress を onClick に変更
    // Note: Clicking the close icon itself doesn't trigger onClick by default
    // You might need a separate handler for the trailingIcon if it's interactive
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
    // Add interaction tests here if needed
  },
};

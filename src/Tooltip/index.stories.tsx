import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Tooltip } from "./index"; // Only import Tooltip now

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  // Default args for the new API
  args: {
    content: "This is the tooltip content.", // Use 'content' prop
    children: <Button>Hover or Focus Me</Button>, // 'children' is the trigger
    variant: "plain",
    delay: 0,
    closeDelay: 100,
    isDisabled: false,
  },
  argTypes: {
    content: { control: "text" }, // Control for tooltip content
    // children cannot be controlled easily in Storybook args
    variant: {
      control: "radio",
      options: ["plain", "rich"],
    },
    placement: {
      control: "select",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top left",
        "top right",
        "bottom left",
        "bottom right",
        "left top",
        "left bottom",
        "right top",
        "right bottom",
      ],
    },
    offset: { control: "number" },
    crossOffset: { control: "number" },
    delay: { control: "number" },
    closeDelay: { control: "number" },
    isDisabled: { control: "boolean" },
    isOpen: { control: "boolean" }, // Note: Controlling isOpen might require state management
    actions: { control: "object" }, // Allow editing actions object/node (might be complex)
  },
  // Render function uses the new API directly
  render: (args) => (
    <div style={{ padding: "50px" }}>
      <Tooltip {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

// --- Updated Stories ---

export const RichWithActions: Story = {
  args: {
    variant: "rich",
    content: (
      <>
        <strong>Confirmation</strong>
        <p style={{ margin: "4px 0 0", padding: 0 }}>
          Are you sure you want to proceed?
        </p>
      </>
    ),
    actions: [
      { label: "Cancel", onPress: () => console.log("Cancel pressed") },
      { label: "Confirm", onPress: () => console.log("Confirm pressed") },
    ],
    children: <Button>Rich w/ Actions Trigger</Button>,
  },
};

export const PlacementBottom: Story = {
  args: {
    placement: "bottom",
    content: "Tooltip appears below.",
    children: <Button>Bottom Placement</Button>,
  },
};

export const WithDelay: Story = {
  args: {
    delay: 500, // 500ms delay before opening
    closeDelay: 200, // Increased close delay example
    content: "Tooltip with custom delays.",
    children: <Button>Delayed Trigger</Button>,
  },
};

// Story showing different variants side-by-side
export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row", // Arrange horizontally
        gap: "20px",
        padding: "50px",
      }}
    >
      <Tooltip content="Plain Top" placement="top">
        <Button>Plain Top</Button>
      </Tooltip>
      <Tooltip
        content={
          <>
            <strong>Rich Bottom</strong>
            <p style={{ margin: "4px 0 0", padding: 0 }}>More details here.</p>
          </>
        }
        variant="rich"
        placement="bottom"
      >
        <Button>Rich Bottom</Button>
      </Tooltip>
      <Tooltip content="Plain Left" placement="left">
        <Button>Plain Left</Button>
      </Tooltip>
      <Tooltip
        content={
          <>
            <strong>Rich Right w/ Actions</strong>
            <p style={{ margin: "4px 0 0", padding: 0 }}>More details here.</p>
          </>
        }
        actions={[
          { label: "Action", onPress: () => console.log("Action pressed") },
        ]}
        variant="rich"
        placement="right"
      >
        <Button>Rich Right</Button>
      </Tooltip>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { Search } from ".";

const meta = {
  component: Search,
  args: {
    // Props for your component
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Search", // Add a default aria-label for the story
  },
};

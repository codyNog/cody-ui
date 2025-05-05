import type { Meta, StoryObj } from "@storybook/react";
import { Divider as Component } from ".";
// import { Box } from "../libs/storybook"; // Box のインポートは削除

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    inset: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    inset: false,
  },
  // Box の代わりに div を使用
  render: (args) => (
    <div style={{ width: "200px", padding: "16px 0" }}>
      <Component {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    inset: false,
  },
  // Box の代わりに div を使用
  render: (args) => (
    <div style={{ height: "50px", padding: "0 16px", display: "flex" }}>
      <Component {...args} />
    </div>
  ),
};

export const Inset: Story = {
  // 複数のバリアントを横並びで表示
  render: () => (
    // Box の代わりに div を使用
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p>Horizontal Inset:</p>
      {/* Box の代わりに div を使用 */}
      <div style={{ width: "200px", border: "1px dashed gray" }}>
        <Component orientation="horizontal" inset />
      </div>
      <p>Vertical Inset:</p>
      {/* Box の代わりに div を使用 */}
      <div
        style={{ height: "50px", border: "1px dashed gray", display: "flex" }}
      >
        <Component orientation="vertical" inset />
      </div>
    </div>
  ),
};

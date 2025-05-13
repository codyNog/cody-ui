import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { MdCheck, MdClose } from "react-icons/md";
import { Switch } from ".";

const meta = {
  component: Switch,
  args: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onChange: action("onChange") as any, // Log actions in Storybook
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <Switch {...args} aria-label="Switch Default Off" />
      <Switch {...args} defaultSelected aria-label="Switch Default On" />
      <Switch {...args} isDisabled aria-label="Switch Disabled Off" />
      <Switch
        {...args}
        defaultSelected
        isDisabled
        aria-label="Switch Disabled On"
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <Switch
        {...args}
        icon={<MdClose className="w-4 h-4" />}
        aria-label="Switch With Icon Off"
      />
      <Switch
        {...args}
        icon={<MdCheck className="w-4 h-4" />}
        defaultSelected
        aria-label="Switch With Icon On"
      />
      <Switch
        {...args}
        icon={<MdClose className="w-4 h-4" />}
        isDisabled
        aria-label="Switch With Icon Disabled Off"
      />
      <Switch
        {...args}
        icon={<MdCheck className="w-4 h-4" />}
        defaultSelected
        isDisabled
        aria-label="Switch With Icon Disabled On"
      />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    children: "Enable Feature",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <Switch {...args} />
      <Switch {...args} defaultSelected />
      <Switch {...args} isDisabled />
      <Switch {...args} defaultSelected isDisabled />
    </div>
  ),
};

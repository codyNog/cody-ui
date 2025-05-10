import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { IconButton as Component } from ".";
import { MdFavorite } from "../Icons";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    icon: <MdFavorite />,
    // onPress のシグネチャに合わせて修正
    onPress: (newSelectedState, pressEvent) => {
      console.log("IconButton pressed!", {
        newSelectedState,
        type: pressEvent.type,
        pointerType: pressEvent.pointerType,
      });
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
    },
    isSelected: {
      control: "boolean",
    },
    isDisabled: {
      control: "boolean",
    },
    // icon: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    "aria-label": "Favorite",
  },
};

export const Standard: Story = {
  args: {
    variant: "standard",
    "aria-label": "Favorite Standard",
    icon: <MdFavorite />,
  },
  render: (args) => (
    <>
      <Component {...args} />
      <Component {...args} isSelected />
      <Component {...args} isDisabled />
      <Component {...args} isSelected isDisabled />
    </>
  ),
};

export const Filled: Story = {
  args: {
    variant: "filled",
    "aria-label": "Favorite Filled",
    icon: <MdFavorite />,
  },
  render: (args) => (
    <>
      <Component {...args} />
      <Component {...args} isSelected />
      <Component {...args} isDisabled />
      <Component {...args} isSelected isDisabled />
    </>
  ),
};

export const Tonal: Story = {
  args: {
    variant: "tonal",
    "aria-label": "Favorite Tonal",
    icon: <MdFavorite />,
  },
  render: (args) => (
    <>
      <Component {...args} />
      <Component {...args} isSelected />
      <Component {...args} isDisabled />
      <Component {...args} isSelected isDisabled />
    </>
  ),
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    "aria-label": "Favorite Outlined",
    icon: <MdFavorite />,
  },
  render: (args) => (
    <>
      <Component {...args} />
      <Component {...args} isSelected />
      <Component {...args} isDisabled />
      <Component {...args} isSelected isDisabled />
    </>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Component aria-label="Standard Favorite" icon={<MdFavorite />} />
        <Component
          aria-label="Standard Favorite Selected"
          isSelected
          icon={<MdFavorite />}
        />
        <Component
          aria-label="Standard Favorite Disabled"
          isDisabled
          icon={<MdFavorite />}
        />
        <Component
          aria-label="Standard Favorite Selected Disabled"
          isSelected
          isDisabled
          icon={<MdFavorite />}
        />
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Component
          variant="filled"
          aria-label="Filled Favorite"
          icon={<MdFavorite />}
        />
        <Component
          variant="filled"
          aria-label="Filled Favorite Selected"
          isSelected
          icon={<MdFavorite />}
        />
        <Component
          variant="filled"
          aria-label="Filled Favorite Disabled"
          isDisabled
          icon={<MdFavorite />}
        />
        <Component
          variant="filled"
          aria-label="Filled Favorite Selected Disabled"
          isSelected
          isDisabled
          icon={<MdFavorite />}
        />
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Component
          variant="tonal"
          aria-label="Tonal Favorite"
          icon={<MdFavorite />}
        />
        <Component
          variant="tonal"
          aria-label="Tonal Favorite Selected"
          isSelected
          icon={<MdFavorite />}
        />
        <Component
          variant="tonal"
          aria-label="Tonal Favorite Disabled"
          isDisabled
          icon={<MdFavorite />}
        />
        <Component
          variant="tonal"
          aria-label="Tonal Favorite Selected Disabled"
          isSelected
          isDisabled
          icon={<MdFavorite />}
        />
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Component
          variant="outlined"
          aria-label="Outlined Favorite"
          icon={<MdFavorite />}
        />
        <Component
          variant="outlined"
          aria-label="Outlined Favorite Selected"
          isSelected
          icon={<MdFavorite />}
        />
        <Component
          variant="outlined"
          aria-label="Outlined Favorite Disabled"
          isDisabled
          icon={<MdFavorite />}
        />
        <Component
          variant="outlined"
          aria-label="Outlined Favorite Selected Disabled"
          isSelected
          isDisabled
          icon={<MdFavorite />}
        />
      </div>
    </div>
  ),
};

export const Behavior: Story = {
  args: {
    "aria-label": "Test Button",
    icon: <MdFavorite />,
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { NavigationRail as Component } from ".";
import { getCanvas } from "../libs/storybook";
import { MdHome, MdSettings, MdFavorite, MdInfo, MdAdd } from "../Icons";
import { Button } from "../Button";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    items: [
      { id: "home", label: "Home", icon: <MdHome />, onPressMenu: fn() },
      {
        id: "favorite",
        label: "Favorite",
        icon: <MdFavorite />,
        badge: 3,
        onPressMenu: fn(),
      },
      {
        id: "settings",
        label: "Settings",
        icon: <MdSettings />,
        onPressMenu: fn(),
        href: "/settings",
      },
      {
        id: "info",
        label: "Info",
        icon: <MdInfo />,
        disabled: true,
        onPressMenu: fn(),
      },
      {
        id: "small_badge",
        label: "Small",
        icon: <MdFavorite />,
        badge: "small",
        onPressMenu: fn(),
      },
      {
        id: "large_badge",
        label: "Large",
        icon: <MdFavorite />,
        badge: "large",
        onPressMenu: fn(),
      },
    ],
    defaultSelectedId: "home",
    onSelectionChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: (args) => (
    <div style={{ height: "400px" }}>
      <Component {...args} />
    </div>
  ),
};

export const WithFAB: Story = {
  args: {
    fab: (
      <Button icon={<MdAdd />} onClick={fn()}>
        <MdAdd />
      </Button>
    ), // icon prop を使用し、childrenにもアイコンを設定（Buttonの仕様に合わせる）
  },
  render: (args) => (
    <div style={{ height: "400px" }}>
      <Component {...args} />
    </div>
  ),
};

export const Behavior: Story = {
  render: (args) => (
    <div style={{ height: "500px" }}>
      <Component {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas.getByText("Home")).toBeInTheDocument();
    expect(canvas.getByText("Favorite")).toBeInTheDocument();
    expect(canvas.getByText("3")).toBeInTheDocument();
    expect(canvas.getByText("Settings")).toBeInTheDocument();
    expect(canvas.getByText("Info")).toBeInTheDocument();

    const homeItem = canvas.getByRole("button", { name: "Home" });
    const favoriteItem = canvas.getByRole("button", { name: "Favorite" });
    const settingsLink = canvas.getByRole("link", { name: "Settings" });

    expect(homeItem).toHaveAttribute("aria-pressed", "true");
    expect(favoriteItem).toHaveAttribute("aria-pressed", "false");

    await favoriteItem.click();
    expect(args.onSelectionChange).toHaveBeenCalledWith("favorite");
    expect(homeItem).toHaveAttribute("aria-pressed", "false");
    expect(favoriteItem).toHaveAttribute("aria-pressed", "true");

    const settingsPressMenu = args.items?.find(
      (item) => item.id === "settings",
    )?.onPressMenu;
    await settingsLink.click();
    expect(settingsPressMenu).toHaveBeenCalled();

    const infoItem = canvas.getByRole("button", { name: "Info" });
    expect(infoItem).toHaveAttribute("aria-disabled", "true");
    const infoPressMenu = args.items?.find(
      (item) => item.id === "info",
    )?.onPressMenu;
    await infoItem.click();
    expect(infoPressMenu).not.toHaveBeenCalled();
    expect(favoriteItem).toHaveAttribute("aria-pressed", "true");
  },
};

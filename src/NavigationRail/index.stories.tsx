import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import { NavigationRail as Component } from ".";
import { Fab } from "../Fab"; // Button の代わりに Fab をインポート
import { MdAdd, MdFavorite, MdHome, MdInfo, MdSettings } from "../Icons";
import { getCanvas } from "../libs/storybook";

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    items: [
      {
        id: "home",
        label: "Home",
        icon: <MdHome />,
        onClick: fn(),
        onHoverChange: fn(),
      }, // onHoverChange を追加
      {
        id: "favorite",
        label: "Favorite",
        icon: <MdFavorite />,
        badge: 3,
        onClick: fn(), // onPressMenu を onClick に変更
        onHoverChange: fn(), // onHoverChange を追加
      },
      {
        id: "settings",
        label: "Settings",
        icon: <MdSettings />,
        onClick: fn(), // onPressMenu を onClick に変更
        href: "/settings",
        onHoverChange: fn(), // onHoverChange を追加
      },
      {
        id: "info",
        label: "Info",
        icon: <MdInfo />,
        disabled: true,
        onClick: fn(), // onPressMenu を onClick に変更
        onHoverChange: fn(), // onHoverChange を追加
      },
      {
        id: "small_badge",
        label: "Small",
        icon: <MdFavorite />,
        badge: "small",
        onClick: fn(), // onPressMenu を onClick に変更
        onHoverChange: fn(), // onHoverChange を追加
      },
      {
        id: "large_badge",
        label: "Large",
        icon: <MdFavorite />,
        badge: "large",
        onClick: fn(), // onPressMenu を onClick に変更
        onHoverChange: fn(), // onHoverChange を追加
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
      // Button を Fab に変更
      <Fab icon={<MdAdd />} aria-label="Add" onClick={fn()} />
    ),
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

    const settingsClickMenu = args.items?.find(
      // settingsPressMenu を settingsClickMenu に変更
      (item) => item.id === "settings",
    )?.onClick; // onPressMenu を onClick に変更
    await settingsLink.click();
    expect(settingsClickMenu).toHaveBeenCalled(); // settingsPressMenu を settingsClickMenu に変更

    const infoItem = canvas.getByRole("button", { name: "Info" });
    expect(infoItem).toHaveAttribute("aria-disabled", "true");
    const infoClickMenu = args.items?.find(
      // infoPressMenu を infoClickMenu に変更
      (item) => item.id === "info",
    )?.onClick; // onPressMenu を onClick に変更
    await infoItem.click();
    expect(infoClickMenu).not.toHaveBeenCalled(); // infoPressMenu を infoClickMenu に変更
    expect(favoriteItem).toHaveAttribute("aria-pressed", "true");
  },
};

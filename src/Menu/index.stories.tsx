import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
// react-icons/md から直接インポート
import {
  MdContentCopy,
  MdContentCut,
  MdContentPaste,
  MdDelete,
  MdEmail,
  MdShare,
  MdSms,
} from "react-icons/md";
import { Button } from "../Button"; // Assuming Button component exists
import { Menu } from "./index";
// import { Icons } from '../Icons'; // 不要なので削除

// --- Menu Item Data ---
// 配列を as const で定義して型推論を厳密にする
const menuItems = [
  { id: "copy", label: "Copy", leadingIcon: <MdContentCopy /> },
  { id: "cut", label: "Cut", leadingIcon: <MdContentCut /> },
  {
    id: "paste",
    label: "Paste",
    leadingIcon: <MdContentPaste />,
    isDisabled: true,
  },
  { type: "separator", id: "sep1" } as const, // as const を追加
  {
    id: "share",
    label: "Share",
    leadingIcon: <MdShare />,
    items: [
      { id: "email", label: "Email", leadingIcon: <MdEmail /> },
      { id: "sms", label: "SMS", leadingIcon: <MdSms /> },
      {
        id: "other",
        label: "Other...",
        items: [
          { id: "app1", label: "Application 1" },
          { id: "app2", label: "Application 2" },
        ],
      },
    ],
  },
  { type: "separator", id: "sep2" } as const, // as const を追加
  {
    id: "delete",
    label: "Delete",
    leadingIcon: <MdDelete />,
    trailingIcon: <span style={{ color: "red" }}>!</span>,
  },
] as const; // 配列全体にも as const

const selectionItems = [
  { id: "bold", label: "Bold" },
  { id: "italic", label: "Italic" },
  { id: "underline", label: "Underline" },
] as const; // こちらも as const

// --- Storybook Meta ---
const meta = {
  component: Menu,
  args: {
    // menuItems は Readonly になるので、Menu コンポーネントが mutable な配列を期待する場合は注意が必要
    // MenuProps の items が ReadonlyArray<MenuItemData> を受け入れられるようにするか、
    // ここで [...menuItems] のようにコピーする必要があるかもしれない。
    // 今回は MenuProps が ReadonlyArray を許容すると仮定する。
    items: menuItems,
    // onAction で Storybook Action と console.log の両方を実行
    onAction: (key) => {
      action("onAction")(key); // Storybook Actions タブへのログ
      console.log(`[Storybook] Menu item clicked: ${String(key)}`); // ブラウザコンソールへのログ
    },
    onSelectionChange: action("onSelectionChange"),
    children: <Button>Open Menu</Button>,
  },
  argTypes: {
    children: { control: { disable: true } }, // Disable control for children
    items: { control: { disable: true } }, // Disable control for items data
    onAction: { action: "onAction" }, // Add onAction to argTypes
    placement: {
      control: "select",
      options: [
        "bottom",
        "bottom left",
        "bottom right",
        "bottom start",
        "bottom end",
        "top",
        "top left",
        "top right",
        "top start",
        "top end",
        "left",
        "left top",
        "left bottom",
        "start",
        "start top",
        "start bottom",
        "right",
        "right top",
        "right bottom",
        "end",
        "end top",
        "end bottom",
      ],
    },
    selectionMode: {
      control: "radio",
      options: ["none", "single", "multiple"],
    },
    selectedKeys: { control: "object" },
    defaultSelectedKeys: { control: "object" },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories ---

export const Default: Story = {};

export const WithSubmenus: Story = {
  args: {
    items: menuItems,
  },
};

export const DisabledMenu: Story = {
  args: {
    isDisabled: true,
    children: <Button isDisabled>Open Menu (Disabled)</Button>,
  },
};

export const DisabledItems: Story = {
  args: {
    items: menuItems, // items already has a disabled item ('paste')
  },
};

export const SingleSelection: Story = {
  args: {
    items: selectionItems,
    selectionMode: "single",
    defaultSelectedKeys: new Set(["italic"]),
    "aria-label": "Text Formatting",
  },
};

export const MultipleSelection: Story = {
  args: {
    items: selectionItems,
    selectionMode: "multiple",
    defaultSelectedKeys: new Set(["bold", "underline"]),
    "aria-label": "Text Formatting",
  },
};

export const DifferentPlacement: Story = {
  args: {
    placement: "right top",
  },
};

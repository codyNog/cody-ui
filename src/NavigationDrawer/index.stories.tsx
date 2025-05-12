import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import { NavigationDrawer } from ".";
import { Button } from "../Button"; // <- ここを修正
import {
  MdArchive,
  MdDelete,
  MdEdit,
  MdFolder,
  MdInbox,
  MdLabel,
  MdPeople,
  MdReport,
  MdSend,
  MdSettings,
  MdStar,
} from "../Icons";

const meta = {
  component: NavigationDrawer,
  args: {
    // headline は削除
  },
  argTypes: {
    onClose: { action: "closed" },
    onItemClick: { action: "itemClicked" },
  },
  parameters: {
    // layout: "fullscreen", // Story ごとに設定
  },
} satisfies Meta<typeof NavigationDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story で再利用するために export する
const sampleSections: ComponentProps<typeof NavigationDrawer>["sections"] = [
  {
    id: "main_section",
    items: [
      {
        id: "inbox",
        type: "link",
        label: "Inbox",
        icon: <MdInbox />,
        href: "/inbox",
        badge: "24",
        isActive: true,
      },
      {
        id: "outbox",
        type: "link",
        label: "Outbox",
        icon: <MdSend />,
        href: "/outbox",
      },
      {
        id: "favorites",
        type: "link",
        label: "Favorites",
        icon: <MdStar />,
        href: "/favorites",
      },
      {
        id: "archived",
        type: "link",
        label: "Archived",
        icon: <MdArchive />,
        href: "/archived",
      },
      {
        id: "trash",
        type: "link",
        label: "Trash",
        icon: <MdDelete />,
        href: "/trash",
      },
      { type: "divider", id: "divider_main" },
      { type: "header", id: "header_labels", label: "All Labels" },
      {
        id: "spam",
        type: "link",
        label: "Spam",
        icon: <MdReport />,
        href: "/spam",
        badge: "99+",
      },
      {
        id: "drafts",
        type: "link",
        label: "Drafts",
        icon: <MdEdit />,
        href: "/drafts",
      },
      {
        id: "shared",
        type: "link",
        label: "Shared with me",
        icon: <MdPeople />,
        href: "/shared",
      },
      { type: "divider", id: "divider_folders" },
      {
        id: "my_folders_group",
        type: "group",
        label: "My Folders",
        icon: <MdFolder />,
        isInitiallyExpanded: true,
        items: [
          {
            id: "folder_work",
            type: "link",
            label: "Work Projects",
            href: "/folders/work",
            icon: <MdFolder />,
          },
          {
            id: "folder_personal",
            type: "link",
            label: "Personal Stuff",
            href: "/folders/personal",
            icon: <MdFolder />,
          },
          { id: "divider_in_my_folders", type: "divider" },
          {
            id: "folder_archive",
            type: "link",
            label: "Old Archives",
            href: "/folders/archive",
            icon: <MdArchive />,
          },
        ],
      },
      {
        id: "categories_group",
        type: "group",
        label: "Categories",
        icon: <MdLabel />,
        isInitiallyExpanded: false,
        items: [
          {
            id: "category_social",
            type: "link",
            label: "Social",
            href: "/categories/social",
            icon: <MdPeople />,
          },
          {
            id: "category_promotions",
            type: "link",
            label: "Promotions",
            href: "/categories/promotions",
            icon: <MdReport />,
          },
          {
            id: "category_forums",
            type: "link",
            label: "Forums",
            href: "/categories/forums",
            icon: <MdEdit />,
          },
        ],
      },
      { type: "divider", id: "divider_settings" },
      {
        id: "settings",
        type: "link",
        label: "Settings",
        icon: <MdSettings />,
        href: "/settings",
      },
    ],
  },
];

export const Standard: Story = {
  args: {
    variant: "standard",
    sections: sampleSections,
    selectedItemId: "inbox",
  },
  parameters: {
    layout: "padded",
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <NavigationDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Modal: Story = {
  args: {
    // <- args を追加
    // <- args を追加
    variant: "modal", // <- variant を追加
    sections: sampleSections,
    selectedItemId: "inbox",
    // variant, open, onClose は render 内で指定するので削除
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <NavigationDrawer
          {...args}
          variant="modal"
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

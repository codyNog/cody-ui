import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { Navigation } from ".";
import {
  MdArchive,
  MdDelete,
  MdEdit,
  MdFavorite,
  MdFolder,
  MdHome,
  MdInbox,
  MdInfo,
  MdLabel,
  MdPeople,
  MdReport,
  MdSend,
  MdSettings,
  MdStar,
} from "../Icons";
import { fn } from "@storybook/test";

const meta = {
  component: Navigation,
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const navigations: ComponentProps<typeof Navigation>["navigations"] = [
  {
    id: "home",
    item: {
      id: "home",
      label: "Home",
      href: "/",
      icon: <MdHome />,
      onClick: fn(),
    },
    sections: [
      {
        id: "home_section",
        items: [
          {
            id: "dashboard",
            type: "link",
            label: "Dashboard",
            icon: <MdHome />,
            href: "/dashboard",
          },
          {
            id: "analytics",
            type: "link",
            label: "Analytics",
            icon: <MdReport />,
            href: "/analytics",
          },
          { type: "divider", id: "divider_home" },
          {
            id: "recent",
            type: "link",
            label: "Recent",
            icon: <MdStar />,
            href: "/recent",
          },
        ],
      },
    ],
  },
  {
    id: "favorite",
    item: {
      id: "favorite",
      label: "Favorite",
      icon: <MdFavorite />,
      badge: 3,
      onClick: fn(),
    },
    sections: [
      {
        id: "mail_section",
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
            id: "favorites_drawer_item",
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
        ],
      },
    ],
  },
  {
    id: "settings",
    item: {
      id: "settings",
      label: "Settings",
      icon: <MdSettings />,
      onClick: fn(),
      href: "/settings",
    },
    sections: [
      {
        id: "settings_section",
        items: [
          {
            id: "general",
            type: "link",
            label: "General",
            icon: <MdSettings />,
            href: "/settings/general",
          },
          {
            id: "account",
            type: "link",
            label: "Account",
            icon: <MdPeople />,
            href: "/settings/account",
          },
          {
            id: "notifications",
            type: "link",
            label: "Notifications",
            icon: <MdReport />,
            href: "/settings/notifications",
          },
          { type: "divider", id: "divider_settings" },
          {
            id: "help",
            type: "link",
            label: "Help & Support",
            icon: <MdEdit />,
            href: "/settings/help",
          },
        ],
      },
    ],
  },
  {
    id: "info",
    item: {
      id: "info",
      label: "Info",
      icon: <MdInfo />,
      disabled: true,
      onClick: fn(),
    },
    sections: [
      {
        id: "info_section",
        items: [
          {
            id: "about_us",
            type: "link",
            label: "About Us",
            icon: <MdInfo />,
            href: "/about",
          },
        ],
      },
    ],
  },
  {
    id: "small_badge",
    item: {
      id: "small_badge",
      label: "Small",
      icon: <MdFavorite />,
      badge: "small",
      onClick: fn(),
    },
    sections: [
      {
        id: "small_badge_section",
        items: [
          {
            id: "small_detail",
            type: "link",
            label: "Small Detail",
            icon: <MdFavorite />,
            href: "/small-detail",
          },
        ],
      },
    ],
  },
  {
    id: "large_badge",
    item: {
      id: "large_badge",
      label: "Large",
      icon: <MdFavorite />,
      badge: "large",
      onClick: fn(),
    },
    sections: [
      {
        id: "large_badge_section",
        items: [
          {
            id: "large_detail",
            type: "link",
            label: "Large Detail",
            icon: <MdFavorite />,
            href: "/large-detail",
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    navigations: navigations,
  },
  render: (args) => <Navigation {...args} />,
};

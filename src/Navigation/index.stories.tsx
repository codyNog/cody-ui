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
import type { NavigationRail } from "../NavigationRail";

const meta = {
  component: Navigation,
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const railItems: ComponentProps<typeof NavigationRail>["items"] = [
  {
    id: "home",
    label: "Home",
    icon: <MdHome />,
    onClick: fn(),
  },
  {
    id: "favorite",
    label: "Favorite",
    icon: <MdFavorite />,
    badge: 3,
    onClick: fn(), // onPressMenu を onClick に変更
  },
  {
    id: "settings",
    label: "Settings",
    icon: <MdSettings />,
    onClick: fn(), // onPressMenu を onClick に変更
    href: "/settings",
  },
  {
    id: "info",
    label: "Info",
    icon: <MdInfo />,
    disabled: true,
    onClick: fn(), // onPressMenu を onClick に変更
  },
  {
    id: "small_badge",
    label: "Small",
    icon: <MdFavorite />,
    badge: "small",
    onClick: fn(), // onPressMenu を onClick に変更
  },
  {
    id: "large_badge",
    label: "Large",
    icon: <MdFavorite />,
    badge: "large",
    onClick: fn(), // onPressMenu を onClick に変更
  },
];

// Story で再利用するために export する
const sampleSections: ComponentProps<typeof Navigation>["drawerSections"] = (
  id: string,
) => {
  switch (id) {
    case "home":
      return [
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
      ];
    case "mail":
      return [
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
          ],
        },
      ];
    case "settings":
      return [
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
      ];
    default:
      return [
        {
          id: "default_section",
          items: [
            {
              id: "dashboard",
              type: "link",
              label: "Dashboard",
              icon: <MdHome />,
              href: "/dashboard",
            },
          ],
        },
      ];
  }
};

export const Default: Story = {
  args: {
    railItems,
    drawerSections: sampleSections,
  },
  render: (args) => <Navigation {...args} />,
};

import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";
import { NavigationDrawer } from ".";
import { Button } from "../Button"; // Modal を開くトリガーとして使用
import {
  MdArchive,
  MdDelete, // IconTrash の代わりに MdDelete を使用
  MdEdit,
  MdFolder,
  MdInbox,
  MdLabel,
  MdPeople,
  MdReport,
  MdSend,
  MdSettings,
  MdStar,
} from "../Icons"; // react-icons/md から Md プレフィックス付きでインポート

const meta = {
  component: NavigationDrawer,
  args: {
    headline: "Mail",
  },
  parameters: {
    layout: "fullscreen", // ModalDrawer が画面全体を使うため
  },
} satisfies Meta<typeof NavigationDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: ComponentProps<typeof NavigationDrawer>["items"] = [
  {
    id: "inbox",
    type: "link",
    label: "Inbox",
    icon: <MdInbox />,
    href: "/inbox",
    badge: "24",
    isActive: true, // 初期状態でアクティブなアイテム
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
    isInitiallyExpanded: true, // 最初から開いておく
    items: [
      {
        id: "folder_work",
        type: "link",
        label: "Work Projects",
        href: "/folders/work",
        icon: <MdFolder />, // グループ内アイテムにもアイコン
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
    icon: <MdLabel />, // カテゴリーなのでラベルアイコン
    isInitiallyExpanded: false, // 最初は閉じておく
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
        icon: <MdReport />, // 迷惑メールアイコンを仮で
      },
      {
        id: "category_forums",
        type: "link",
        label: "Forums",
        href: "/categories/forums",
        icon: <MdEdit />, // ドラフトアイコンを仮で
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
];

export const Standard: Story = {
  args: {
    variant: "standard",
    items: sampleItems,
    selectedItemId: "inbox", // 初期選択アイテム
  },
  render: (args) => (
    <div
      style={{ height: "600px" /* Standard Drawer が見えるように高さを確保 */ }}
    >
      <NavigationDrawer {...args} />
    </div>
  ),
};

export const Modal: Story = {
  args: {
    variant: "modal",
    items: sampleItems,
    headline: "App Name",
    selectedItemId: "inbox",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: "20px", height: "calc(100vh - 40px)" }}>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <NavigationDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onItemClick={(item) => {
            // eslint-disable-next-line no-console
            console.log("Item clicked:", item);
            // ここで選択状態を更新するロジックも追加できる
            // setSelectedItemId(item.id); // Storybook内で状態を持つ場合
            setOpen(false); // Modal の場合はアイテムクリックで閉じるのが一般的
          }}
        />
      </div>
    );
  },
};

// 複数のバリアントを並べて表示するストーリー
export const AllVariants: Story = {
  args: {
    // 型エラー回避のため、render 関数内で直接使用せずとも必須 props を設定
    variant: "standard", // 仮の値
    items: [], // 仮の値
  },
  parameters: {
    layout: "padded", // fullscreen だと standard が見切れる可能性があるので padded に
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openModal, setOpenModal] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedId, setSelectedId] = useState<string | undefined>("inbox");

    const handleItemClick = (
      item: ComponentProps<typeof NavigationDrawer>["items"][number],
    ) => {
      // eslint-disable-next-line no-console
      console.log("Item clicked:", item);
      setSelectedId(item.id);
      setOpenModal(false); // Modal の場合は閉じる
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          height: "700px",
        }}
      >
        <div>
          <h3>Standard</h3>
          <div
            style={{ width: "360px", height: "100%", border: "1px solid #ccc" }}
          >
            <NavigationDrawer
              variant="standard"
              items={sampleItems}
              headline="Standard Drawer"
              selectedItemId={selectedId}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
        <div>
          <h3>Modal</h3>
          <Button onClick={() => setOpenModal(true)}>Open Modal Drawer</Button>
          <NavigationDrawer
            variant="modal"
            items={sampleItems}
            headline="Modal Drawer"
            open={openModal}
            onClose={() => setOpenModal(false)}
            selectedItemId={selectedId}
            onItemClick={handleItemClick}
          />
        </div>
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react"; // ComponentProps をインポート
// import type { CheckboxListItem } from "./index"; // 不要なインポートを削除
import { CheckboxList } from "./index";

// ComponentPropsを使ってitemsの型を取得
type CheckboxListProps = ComponentProps<typeof CheckboxList>;
type CheckboxListItem = CheckboxListProps["items"][number]; // 配列の要素の型を取得

// --- Sample Data ---

const sampleItems: CheckboxListItem[] = [
  {
    id: "1", // IDをstringに
    label: "Parent 1 (All Unchecked)",
    state: "unchecked", // checked -> state
    children: [
      { id: "1-1", label: "Child 1-1", state: "unchecked" },
      { id: "1-2", label: "Child 1-2", state: "unchecked" },
    ],
  },
  {
    id: "2",
    label: "Parent 2 (Mixed)",
    state: "indeterminate", // 親は中間状態
    children: [
      { id: "2-1", label: "Child 2-1", state: "checked" },
      { id: "2-2", label: "Child 2-2", state: "unchecked" },
      {
        id: "2-3",
        label: "Child 2-3 (Disabled)",
        state: "unchecked",
        isDisabled: true,
      }, // disabled -> isDisabled
    ],
  },
  {
    id: "3",
    label: "Parent 3 (All Checked)",
    state: "checked",
    children: [
      { id: "3-1", label: "Child 3-1", state: "checked" },
      { id: "3-2", label: "Child 3-2", state: "checked" },
    ],
  },
  { id: "4", label: "Item 4 (No Children)", state: "unchecked" },
  { id: "5", label: "Item 5 (Disabled)", state: "unchecked", isDisabled: true },
];

// --- Storybook Meta ---

const meta = {
  component: CheckboxList,
  args: {
    // Interactive storyの初期状態用にディープコピー
    items: JSON.parse(JSON.stringify(sampleItems)),
  },
} satisfies Meta<typeof CheckboxList>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Individual Stories ---

export const Default: Story = {
  args: {
    items: sampleItems,
    onChange: (updatedItems) => console.log("Default onChange:", updatedItems),
  },
};

export const Interactive: Story = {
  render: function Render(args) {
    // Story内で状態を管理するためにuseStateを使用
    const [items, setItems] = useState<CheckboxListItem[]>(args.items);

    const handleChange = (updatedItems: CheckboxListItem[]) => {
      setItems(updatedItems); // 内部状態を更新
      // StorybookのActionsタブにもログを出力（args.onChangeが渡されていれば）
      args.onChange?.(updatedItems);
      console.log("Interactive onChange:", updatedItems);
    };

    // CheckboxListに現在の状態と更新用ハンドラを渡す
    return <CheckboxList {...args} items={items} onChange={handleChange} />;
  },
  // argsはmetaから引き継がれるが、必要ならここで上書きや追加も可能
};

import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { type ComponentProps, type ReactNode, useState } from "react"; // ComponentProps をインポート
import { SideSheet as Component } from ".";
import { Button } from "../Button";

// SideSheetProps を ComponentProps を使って取得
type SideSheetProps = ComponentProps<typeof Component>;

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    headline: "サイドシートのタイトルだよ",
    content: (
      <>
        <p>これがサイドシートの中身だよん。</p>
        <p>色々書けるね！</p>
        {[...Array(20)].map((_, i) => {
          const key = `scroll-item-${i}`;
          return (
            <p key={key}>スクロールもできるかな？ Item {i + 1}</p> // keyを修正
          );
        })}
      </>
    ),
    actions: [
      {
        label: "キャンセル",
        variant: "outlined",
        onPress: () => alert("キャンセルしたよ"),
      },
      { label: "OK", onPress: () => alert("OKしたよ") },
    ],
    children: <Button>サイドシートを開く</Button>,
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

type StatefulWrapperProps = Omit<SideSheetProps, "onOpenChange" | "isOpen"> & {
  initialOpen?: boolean;
  children: ReactNode;
};

const StatefulSideSheet = (props: StatefulWrapperProps) => {
  const { initialOpen, children, ...restProps } = props;
  const [isOpen, setIsOpen] = useState(initialOpen ?? false);

  const completeProps = {
    ...meta.args,
    ...restProps,
  } as SideSheetProps;

  return (
    <Component {...completeProps} isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Component>
  );
};

export const Default: Story = {
  args: {},
  render: (args) => <StatefulSideSheet {...(args as StatefulWrapperProps)} />,
};

export const NoActions: Story = {
  args: {
    actions: [],
    children: <Button>アクションなしで開く</Button>,
  },
  render: (args) => <StatefulSideSheet {...(args as StatefulWrapperProps)} />,
};

export const Behavior: Story = {
  args: {},
  render: (args) => (
    <Component {...args}>
      {args.children ?? <Button>テスト用のボタン</Button>}
    </Component>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const triggerButtonText =
      args.children &&
      typeof args.children === "object" &&
      "props" in args.children &&
      args.children.props && // propsの存在チェック
      typeof args.children.props === "object" && // propsがオブジェクトであることを確認
      "children" in args.children.props && // props.childrenの存在チェック
      args.children.props.children
        ? (args.children.props.children as string) // 型アサーション
        : "テスト用のボタン";
    const triggerButton = canvas.getByRole("button", {
      name: triggerButtonText,
    });

    await userEvent.click(triggerButton);
    await new Promise((resolve) => setTimeout(resolve, 500));
    let sheetTitle = await canvas.findByText(args.headline as string);
    expect(sheetTitle).toBeTruthy();

    if (args.actions && args.actions.length > 0) {
      const firstAction = args.actions[0];
      const actionButton = await canvas.findByRole("button", {
        name: firstAction.label,
      });
      expect(actionButton).toBeTruthy();
    }

    const overlay = document.querySelector('[data-vaul-overlay="true"]');
    if (overlay instanceof HTMLElement) {
      await userEvent.click(overlay);
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(canvas.queryByText(args.headline as string)).toBeNull();

      await userEvent.click(triggerButton);
      await new Promise((resolve) => setTimeout(resolve, 500));
      sheetTitle = await canvas.findByText(args.headline as string);
      expect(sheetTitle).toBeTruthy();

      await userEvent.keyboard("{escape}");
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(canvas.queryByText(args.headline as string)).toBeNull();
    } else {
      console.warn(
        "Overlay not found or not an HTMLElement, skipping overlay click test.",
      );
      await userEvent.keyboard("{escape}");
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(canvas.queryByText(args.headline as string)).toBeNull();
    }
  },
};

export const VariantsComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <StatefulSideSheet
        headline="右から標準"
        content={<p>これは右から出てくる標準的なサイドシートだよ。</p>}
        actions={[{ label: "閉じる", onPress: () => {} }]}
        // childrenをJSXの子要素として渡すように修正
      >
        <Button>右から標準</Button>
      </StatefulSideSheet>
      {/* TODO: 左から出てくる variant が実装されたら追加する */}
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { type ComponentProps, type ReactNode, useState } from "react";
import { BottomSheet as Component } from ".";
import { Button } from "../Button";

type BottomSheetProps = ComponentProps<typeof Component>;

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    headline: "ボトムシートのタイトルだよ",
    content: (
      <>
        <p>これがボトムシートの中身だよん。</p>
        <p>下から出てくるやつ！</p>
        {[...Array(20)].map((_, i) => {
          // ちょっと少なめに
          const key = `scroll-item-${i}`;
          return <p key={key}>スクロールもできるかな？ Item {i + 1}</p>;
        })}
      </>
    ),
    children: <Button>ボトムシートを開く</Button>,
    showHandle: true,
    variant: "standard", // デフォルトは standard
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

type StatefulWrapperProps = Omit<
  BottomSheetProps,
  "onOpenChange" | "isOpen"
> & {
  initialOpen?: boolean;
  children: ReactNode;
};

const StatefulBottomSheet = (props: StatefulWrapperProps) => {
  const { initialOpen, children, ...restProps } = props;
  const [isOpen, setIsOpen] = useState(initialOpen ?? false);

  const completeProps = {
    ...meta.args,
    ...restProps,
  } as BottomSheetProps; // 型アサーションを修正

  return (
    <Component {...completeProps} isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Component>
  );
};

export const Default: Story = {
  args: {},
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const ModalVariant: Story = {
  args: {
    variant: "modal",
    children: <Button>ボトムシートを開く (Modal)</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const NoHeader: Story = {
  args: {
    headline: undefined,
    children: <Button>タイトルなし</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const NoHandle: Story = {
  args: {
    showHandle: false,
    children: <Button>ハンドルなし</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const OnlyContent: Story = {
  args: {
    headline: undefined,
    showHandle: false,
    children: <Button>コンテンツのみ</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const Behavior: Story = {
  args: {
    // BehaviorテストではModalで実行するのが一般的か
    variant: "modal",
    children: <Button>テスト用 (Modal)</Button>,
  },
  render: (args) => (
    // StatefulBottomSheet を使って isOpen と onOpenChange を管理
    <StatefulBottomSheet {...(args as StatefulWrapperProps)}>
      {args.children ?? <Button>テスト用のボタン</Button>}
    </StatefulBottomSheet>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // args.children が Button コンポーネントであることを前提とする
    const triggerButton = canvas.getByRole("button", {
      name:
        args.children &&
        typeof args.children === "object" &&
        "props" in args.children &&
        args.children.props &&
        typeof args.children.props === "object" &&
        "children" in args.children.props &&
        args.children.props.children
          ? (args.children.props.children as string)
          : "テスト用のボタン",
    });

    // 1. トリガーボタンをクリックして開く
    await userEvent.click(triggerButton);
    await new Promise((resolve) => setTimeout(resolve, 500)); // vaulのアニメーション待機

    const sheetTitleText = args.headline;
    if (sheetTitleText) {
      const sheetTitle = await canvas.findByText(sheetTitleText);
      expect(sheetTitle).toBeInTheDocument();
    }

    // 3. オーバーレイをクリックして閉じる
    // variant によってオーバーレイの挙動が変わる
    if (args.variant === "modal") {
      const overlay = document.querySelector('[data-vaul-overlay="true"]');
      expect(overlay).toBeInTheDocument(); // モーダルならオーバーレイがあるはず
      if (overlay instanceof HTMLElement) {
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500)); // アニメーション待機
        if (sheetTitleText) {
          expect(canvas.queryByText(sheetTitleText)).not.toBeInTheDocument();
        }

        // 再度トリガーボタンをクリックして開く
        await userEvent.click(triggerButton);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          const reappearedSheetTitle = await canvas.findByText(sheetTitleText);
          expect(reappearedSheetTitle).toBeInTheDocument();
        }
      }
    } else {
      // standard の場合、オーバーレイは存在しないか、クリックしても閉じない
      const overlay = document.querySelector('[data-vaul-overlay="true"]');
      // vaulではmodal=falseでもoverlayが生成されることがあるが、通常は透明でインタラクションを持たない
      // ここではoverlayがあってもクリックで閉じないことを期待する
      if (overlay instanceof HTMLElement) {
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          // 開いたままであることを確認
          const sheetTitle = await canvas.findByText(sheetTitleText);
          expect(sheetTitle).toBeInTheDocument();
        }
      }
    }

    // Escapeキーでのクローズは variant によらず機能するはず
    await userEvent.keyboard("{escape}");
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (sheetTitleText) {
      expect(canvas.queryByText(sheetTitleText)).not.toBeInTheDocument();
    }
  },
};

export const VisualComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <StatefulBottomSheet
        headline="Standard Variant"
        content={<p>これは Standard (非モーダル) のボトムシートだよ。</p>}
        variant="standard"
        showHandle
      >
        <Button>Standard</Button>
      </StatefulBottomSheet>
      <StatefulBottomSheet
        headline="Modal Variant"
        content={<p>これは Modal のボトムシートだよ。</p>}
        variant="modal"
        showHandle
      >
        <Button>Modal</Button>
      </StatefulBottomSheet>
      <StatefulBottomSheet
        headline="Modal (ハンドルなし)"
        content={<p>ハンドルがない Modal。</p>}
        variant="modal"
        showHandle={false}
      >
        <Button>Modal (No Handle)</Button>
      </StatefulBottomSheet>
    </div>
  ),
};

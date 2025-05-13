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
          const key = `scroll-item-${i}`;
          return <p key={key}>スクロールもできるかな？ Item {i + 1}</p>;
        })}
      </>
    ),
    children: <Button>ボトムシートを開く</Button>,
    showHandle: true,
    variant: "standard",
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
  } as BottomSheetProps;

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
    variant: "modal",
    children: <Button>テスト用 (Modal)</Button>,
  },
  render: (args) => (
    <StatefulBottomSheet {...(args as StatefulWrapperProps)}>
      {args.children ?? <Button>テスト用のボタン</Button>}
    </StatefulBottomSheet>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
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

    await userEvent.click(triggerButton);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sheetTitleText = args.headline;
    if (sheetTitleText) {
      const sheetTitle = await canvas.findByText(sheetTitleText);
      expect(sheetTitle).toBeInTheDocument();
    }

    if (args.variant === "modal") {
      const overlay = document.querySelector('[data-vaul-overlay="true"]');
      expect(overlay).toBeInTheDocument();
      if (overlay instanceof HTMLElement) {
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          expect(canvas.queryByText(sheetTitleText)).not.toBeInTheDocument();
        }

        await userEvent.click(triggerButton);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          const reappearedSheetTitle = await canvas.findByText(sheetTitleText);
          expect(reappearedSheetTitle).toBeInTheDocument();
        }
      }
    } else {
      const overlay = document.querySelector('[data-vaul-overlay="true"]');
      if (overlay instanceof HTMLElement) {
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          const sheetTitle = await canvas.findByText(sheetTitleText);
          expect(sheetTitle).toBeInTheDocument();
        }
      }
    }

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

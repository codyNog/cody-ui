import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { type ComponentProps, type ReactNode, useState } from "react";
import { BottomSheet as Component } from ".";
import { Button } from "../Button";

type BottomSheetProps = ComponentProps<typeof Component>;

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    headline: "This is the BottomSheet Title",
    content: (
      <>
        <p>This is the content of the bottom sheet.</p>
        <p>It slides up from the bottom!</p>
        {[...Array(20)].map((_, i) => {
          const key = `scroll-item-${i}`;
          return <p key={key}>Can it scroll? Item {i + 1}</p>;
        })}
      </>
    ),
    children: <Button>Open BottomSheet</Button>,
    showHandle: true,
    variant: "standard",
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

/**
 * Props for the StatefulBottomSheet wrapper component.
 * This component manages the open/closed state of the BottomSheet for Storybook.
 */
type StatefulWrapperProps = Omit<
  BottomSheetProps,
  "onOpenChange" | "isOpen"
> & {
  /**
   * The initial open state of the BottomSheet.
   * @default false
   */
  initialOpen?: boolean;
  /**
   * The trigger element for the BottomSheet.
   */
  children: ReactNode;
};

/**
 * A wrapper component for `BottomSheet` that manages its open/closed state internally.
 * This is useful for Storybook stories where you want to demonstrate the BottomSheet's
 * behavior without managing state externally in each story.
 */
const StatefulBottomSheet = (props: StatefulWrapperProps) => {
  const { initialOpen, children, ...restProps } = props;
  const [isOpen, setIsOpen] = useState(initialOpen ?? false);

  const completeProps = {
    ...meta.args, // Default args from meta
    ...restProps, // Args passed to the story
  } as BottomSheetProps; // Cast to ensure all required props are present

  return (
    <Component {...completeProps} isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Component>
  );
};

export const Default: Story = {
  args: {}, // Uses default args from meta
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const ModalVariant: Story = {
  args: {
    variant: "modal",
    children: <Button>Open BottomSheet (Modal)</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const NoHeader: Story = {
  args: {
    headline: undefined,
    children: <Button>No Header</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const NoHandle: Story = {
  args: {
    showHandle: false,
    children: <Button>No Handle</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const OnlyContent: Story = {
  args: {
    headline: undefined,
    showHandle: false,
    children: <Button>Content Only</Button>,
  },
  render: (args) => <StatefulBottomSheet {...(args as StatefulWrapperProps)} />,
};

export const Behavior: Story = {
  args: {
    variant: "modal",
    children: <Button>Test (Modal)</Button>,
  },
  render: (args) => (
    <StatefulBottomSheet {...(args as StatefulWrapperProps)}>
      {args.children ?? <Button>Test Button</Button>}
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
          : "Test Button",
    });

    await userEvent.click(triggerButton);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation

    const sheetTitleText = args.headline;
    if (sheetTitleText) {
      const sheetTitle = await canvas.findByText(sheetTitleText);
      expect(sheetTitle).toBeInTheDocument();
    }

    // Test closing by clicking overlay (for modal) or outside (for standard)
    if (args.variant === "modal") {
      const overlay = document.querySelector('[data-vaul-overlay="true"]');
      expect(overlay).toBeInTheDocument();
      if (overlay instanceof HTMLElement) {
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation
        if (sheetTitleText) {
          expect(canvas.queryByText(sheetTitleText)).not.toBeInTheDocument();
        }

        // Reopen to test Esc key
        await userEvent.click(triggerButton);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation
        if (sheetTitleText) {
          const reappearedSheetTitle = await canvas.findByText(sheetTitleText);
          expect(reappearedSheetTitle).toBeInTheDocument();
        }
      }
    } else {
      // For standard variant, clicking outside (e.g., on the body) should not close it
      // Vaul's standard variant doesn't close on outside click by default.
      // This part of the test might need adjustment based on desired standard behavior.
      const overlay = document.querySelector('[data-vaul-overlay="true"]'); // Overlay still exists for standard
      if (overlay instanceof HTMLElement) {
        // Clicking the overlay of a standard sheet does nothing by default in Vaul
        await userEvent.click(overlay);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (sheetTitleText) {
          const sheetTitle = await canvas.findByText(sheetTitleText); // Should still be there
          expect(sheetTitle).toBeInTheDocument();
        }
      }
    }

    // Test closing with Escape key
    await userEvent.keyboard("{escape}");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation
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
        content={<p>This is a Standard (non-modal) bottom sheet.</p>}
        variant="standard"
        showHandle
      >
        <Button>Standard</Button>
      </StatefulBottomSheet>
      <StatefulBottomSheet
        headline="Modal Variant"
        content={<p>This is a Modal bottom sheet.</p>}
        variant="modal"
        showHandle
      >
        <Button>Modal</Button>
      </StatefulBottomSheet>
      <StatefulBottomSheet
        headline="Modal (No Handle)"
        content={<p>A Modal bottom sheet without a handle.</p>}
        variant="modal"
        showHandle={false}
      >
        <Button>Modal (No Handle)</Button>
      </StatefulBottomSheet>
    </div>
  ),
};

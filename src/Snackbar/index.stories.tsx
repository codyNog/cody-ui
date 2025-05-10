import type { Meta, StoryObj } from "@storybook/react";
import { type SnackbarContent, useSnackbar } from "."; // SnackbarProviderのインポートを削除
import { Button } from "../Button"; // プロジェクト内のButtonコンポーネントをインポート

const meta = {
  component: undefined, // Snackbarコンポーネント自体は直接レンダリングしないためundefined
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    supportingText: { control: "text" },
    action: { control: "object" },
    closeable: { control: "boolean" },
  },
} satisfies Meta<SnackbarContent>; // SnackbarPropsを使用

export default meta;
type Story = StoryObj<typeof meta>;

// Snackbarを表示するデモ用のコンポーネント
const SnackbarDemo = (args: SnackbarContent) => {
  const { add } = useSnackbar();
  const handleShowSnackbar = () => {
    add({
      supportingText:
        args.supportingText || "This is a supporting text for the snackbar.",
      action: args.action,
      closeable: args.closeable,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <p>Click the button to show a Snackbar.</p>
      <Button
        onClick={() => {
          handleShowSnackbar();
        }}
      >
        Show Snackbar
      </Button>
      <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        Note: Snackbar appears at the bottom of the screen.
      </p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        SnackbarProps are for controlling the content of the Snackbar shown by
        the button.
      </p>
    </div>
  );
};

export const Default: Story = {
  args: {
    title: "Default Snackbar",
    supportingText: "This is a default snackbar message.",
    action: {
      label: "Action",
      onClick: () => alert("Action clicked!"), // onPress を onClick に変更
    },
    closeable: true,
  },
  render: (args) => <SnackbarDemo {...args} />,
};

export const WithTitleOnly: Story = {
  args: {
    title: "Title Only Snackbar",
    supportingText: undefined,
    action: undefined,
    closeable: true,
  },
  render: (args) => <SnackbarDemo {...args} />,
};

export const WithSupportingTextOnly: Story = {
  args: {
    title: undefined,
    supportingText: "This Snackbar only has supporting text.",
    action: undefined,
    closeable: true,
  },
  render: (args) => <SnackbarDemo {...args} />,
};

export const WithAction: Story = {
  args: {
    title: "Action Snackbar",
    supportingText: "Press the action button.",
    action: {
      label: "Retry",
      onClick: () => {
        // onPress を onClick に変更
        alert("Retry button clicked!");
      },
    },
    closeable: true,
  },
  render: (args) => <SnackbarDemo {...args} />,
};

export const NotCloseable: Story = {
  args: {
    title: "Not Closeable",
    supportingText:
      "This snackbar cannot be closed by the user directly (unless an action closes it or timeout).",
    action: {
      label: "Okay",
      onClick: () => {
        // onPress を onClick に変更
        /* 何もしないか、特定の処理 */
      },
    },
    closeable: false,
  },
  render: (args) => <SnackbarDemo {...args} />,
};

export const MultipleSnackbars: Story = {
  args: {}, // このストーリーではargsは使わない
  render: () => {
    const { add } = useSnackbar();
    const showMultiple = () => {
      add({ supportingText: "I will disappear first." }, { timeout: 3000 });
      setTimeout(() => {
        add({ supportingText: "I am the second one." }, { timeout: 5000 });
      }, 700);
      setTimeout(() => {
        add(
          {
            supportingText: "I have no action and cannot be closed by 'x'.",
            closeable: false,
          },
          { timeout: 7000 },
        );
      }, 1400);
    };
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <p>
          Click the button to show multiple Snackbars with different timeouts.
        </p>
        <Button onClick={showMultiple}>Show Multiple Snackbars</Button>{" "}
        {/* onPress を onClick に変更 */}
      </div>
    );
  },
};

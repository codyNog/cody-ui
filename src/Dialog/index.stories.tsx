import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Dialog } from "."; // Dialogのみをインポート
import { Button } from "../Button"; // Buttonコンポーネントをインポート (仮)
import { getCanvas } from "../libs/storybook";

// Meta情報をDialogTriggerに向けるか、Dialogに向けるか検討。
// DialogTriggerがユーザーインタラクションの起点となるため、DialogTriggerが良い場合もある。
// ここではDialogのバリエーションを見せるためDialogをcomponentとする。
const meta: Meta<typeof Dialog> = {
  component: Dialog,
  // subcomponentsもStorybook 7以降では推奨されていないが、関連性を示すために記載
  // subcomponents: { DialogTrigger },
  // argTypesでDialogTriggerのchildrenをコントロールできるようにするのもあり
};

export default meta;

// Storyの型もDialogPropsに合わせる
type Story = StoryObj<typeof Dialog>;

const commonDialogProps = {
  // headline and supportingText are common
  headline: "Dialog Headline",
  supportingText:
    "This is the supporting text for the dialog. It can be a bit longer to explain the context or consequences of the actions.",
};

const basicDialogActions = [
  { label: "Cancel", onPress: () => console.log("Cancel pressed") },
  { label: "OK", onPress: () => console.log("OK pressed") },
];

export const Default: Story = {
  args: {
    ...commonDialogProps,
    actions: basicDialogActions,
    children: <Button>Open Dialog</Button>,
    variant: "basic", // Explicitly set for clarity
  },
};

export const WithIcon: Story = {
  args: {
    ...commonDialogProps,
    actions: basicDialogActions,
    icon: <span>🎉</span>, // Example icon
    headline: "Dialog With Icon",
    children: <Button>Open Dialog with Icon</Button>,
    variant: "basic", // Explicitly set for clarity
  },
};

export const FullScreen: Story = {
  args: {
    ...commonDialogProps, // headline, supportingText (though supportingText might not be used in FS)
    variant: "full-screen",
    headline: "Full Screen Dialog",
    // For FullScreen, we need dialogContent and potentially headerActions
    dialogContent: <p>This is the main content of the full-screen dialog.</p>,
    headerActions: [
      {
        label: "Save",
        onPress: async () => {
          // Simulate async operation (e.g., API call, validation)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Save pressed and async operation completed!");
          // To simulate a failure, you could throw an error:
          // throw new Error("Simulated save failure");
        },
      },
    ],
    children: <Button>Open Full Screen Dialog</Button>,
  },
};

export const Behavior: Story = {
  args: {
    ...commonDialogProps,
    children: <Button>Open Dialog for Behavior Test</Button>,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = getCanvas(canvasElement);
    const triggerButton = canvas.getByRole("button", {
      name: /Open Dialog for Behavior Test/i,
    });

    // Dialogが最初は表示されていないことを確認 (ModalなのでDOMには存在するが非表示)
    // react-aria-componentsではDialogはレンダリングされるが、CSSで非表示になっている
    // そのため、getByRoleなどで取得はできるが、visibleではないことを確認する
    // もしくは、Dialogのコンテンツが最初は見えないことを確認する
    if (args.headline) {
      expect(canvas.queryByText(args.headline)).toBeNull();
    }

    // トリガーボタンをクリックしてDialogを開く
    await userEvent.click(triggerButton);

    // Dialogが表示されたことを確認 (Dialogのheadlineが表示されているか)
    // withinを使ってDialogのスコープで要素を検索
    const dialog = await canvas.findByRole("dialog");
    const dialogCanvas = within(dialog);

    if (args.headline) {
      const headlineElement = await dialogCanvas.findByText(args.headline);
      expect(headlineElement).toBeVisible();
    }

    // アクションボタンが表示されていることを確認
    if (args.variant === "basic" && args.actions) {
      for (const action of args.actions) {
        const buttonElement = await dialogCanvas.findByText(action.label);
        expect(buttonElement).toBeVisible();
        // 必要であればボタンのクリックテストも追加
      }
    } else if (args.variant === "full-screen" && args.headerActions) {
      for (const action of args.headerActions) {
        const buttonElement = await dialogCanvas.findByText(action.label);
        expect(buttonElement).toBeVisible();
      }
    }

    // 例: OKボタンをクリックしてDialogを閉じる (閉じるロジックが実装されていれば)
    // const okButton = await dialogCanvas.findByText("OK");
    // await userEvent.click(okButton);
    // expect(canvas.queryByRole("dialog")).toBeNull(); // Dialogが閉じたことを確認
  },
};

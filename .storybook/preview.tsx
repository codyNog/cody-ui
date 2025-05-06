import { withThemeByClassName } from "@storybook/addon-themes"; // インポート追加
import type { Preview } from "@storybook/react";
import "../src/global.css"; // Add this line to import global styles
import "./custom-theme.css"; // Import custom theme styles
import { Provider } from "../src/Provider";

const preview: Preview = {
  parameters: {
    // アドオンパネル、ツールバー、サイドバーを非表示にする設定
    // toolbar: { // テーマ選択ツールバーを表示するためコメントアウト or 削除
    //   hidden: true,
    // },
    sidebar: {
      hidden: true,
    },
    controls: {
      disable: false, // Enable controls
      expanded: true, // Optionally expand by default
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Add tags here to enable Autodocs for all stories
  tags: ["autodocs"],
  decorators: [
    // withThemeByClassName を decorators の最初に追加
    withThemeByClassName({
      themes: {
        // デフォルトテーマ（クラスなし）
        light: "",
        // カスタムテーマ（例: custom-theme クラス）
        custom: "custom-theme",
      },
      defaultTheme: "light",
    }),
    // 既存の Provider decorator
    (Story) => (
      <Provider locale="ja-JP">
        <Story />
      </Provider>
    ),
  ],
  // globalTypes を追加してツールバーにテーマ選択を表示
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        // ドロップダウンの選択肢
        items: [
          { value: "light", title: "Light (Default)" },
          { value: "custom", title: "Custom" },
        ],
        showName: true,
      },
    },
  },
};

export default preview;

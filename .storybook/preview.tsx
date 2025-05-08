import type { Preview } from "@storybook/react";
import "../src/theme.css"; // Import theme.css
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
    (Story, context) => {
      const { theme } = context.globals;

      // Set color-scheme based on theme
      if (theme === "light" || theme === "dark") {
        document.documentElement.style.colorScheme = theme;
      } else {
        // For 'custom' or other themes, you might want to remove or set a default
        document.documentElement.style.colorScheme = "";
      }

      return (
        <Provider locale="ja-JP">
          <Story />
        </Provider>
      );
    },
    // 既存の Provider decorator
    // (Story) => (
    //   <Provider locale="ja-JP">
    //     <Story />
    //   </Provider>
    // ),
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
          { value: "dark", title: "Dark" }, // Darkテーマの選択肢を追加
          { value: "custom", title: "Custom" },
        ],
        showName: true,
      },
    },
  },
};

export default preview;

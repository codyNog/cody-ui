import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-themes", // Add this line
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // JSDocのコメントをパースに含めるようにする
      // (プロジェクトのtsconfig.jsonと設定を合わせるのが理想)
      // compilerOptions: { jsx: 'react-jsx' },
    },
  },
  docs: {
    autodocs: "tag", // preview.tsxの設定と合わせる
  },
};
export default config;

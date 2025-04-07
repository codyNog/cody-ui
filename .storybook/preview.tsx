import type { Preview } from "@storybook/react";
import "../src/global.css"; // Add this line to import global styles
import { Provider } from "../src/Provider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Add tags here to enable Autodocs for all stories
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider locale="ja-JP">
        <Story />
      </Provider>
    ),
  ],
};

export default preview;

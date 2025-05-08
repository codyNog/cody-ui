import type { Meta, StoryObj } from "@storybook/react";
import { Badge as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <div>
        <p>Small:</p>
        <Component variant="small" />
      </div>
      <div>
        <p>Large (no count):</p>
        <Component variant="large" />
      </div>
      <div>
        <p>Large (count: 1):</p>
        <Component variant="large" count={1} />
      </div>
      <div>
        <p>Large (count: 7):</p>
        <Component variant="large" count={7} />
      </div>
      <div>
        <p>Large (count: 99):</p>
        <Component variant="large" count={99} />
      </div>
      <div>
        <p>Large (count: 100 - shows 99+):</p>
        <Component variant="large" count={100} />
      </div>
      <div>
        <p>Large (count: 1000 - shows 99+):</p>
        <Component variant="large" count={1000} />
      </div>
    </div>
  ),
};

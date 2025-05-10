import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from ".";

const meta = {
  component: Typography,
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = [
  "displayLarge",
  "displayMedium",
  "displaySmall",
  "headlineLarge",
  "headlineMedium",
  "headlineSmall",
  "titleLarge",
  "titleMedium",
  "titleSmall",
  "bodyLarge",
  "bodyMedium",
  "bodySmall",
  "labelLarge",
  "labelMedium",
  "labelSmall",
] as const;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {variants.map((variant) => (
        <div key={variant} style={{ marginBottom: "8px" }}>
          <Typography {...args} variant={variant}>
            {variant}
          </Typography>
        </div>
      ))}
    </div>
  ),
  args: {
    children: "Typography",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "32px",
        alignItems: "baseline",
      }}
    >
      {variants.map((variant) => (
        <div key={variant} style={{ textAlign: "center" }}>
          <Typography {...args} variant={variant}>
            {args.children ?? variant}
          </Typography>
          <p style={{ fontSize: "10px", color: "gray", marginTop: "4px" }}>
            {variant}
          </p>
        </div>
      ))}
    </div>
  ),
  args: {
    children: "Aa", // 短いテキストで見比べやすく
  },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography {...args} color="primary">
        Primary Color
      </Typography>
      <Typography {...args} color="secondary">
        Secondary Color
      </Typography>
      <Typography {...args} color="tertiary">
        Tertiary Color
      </Typography>
      <Typography {...args} color="error">
        Error Color
      </Typography>
      <Typography {...args} color="onSurface">
        On Surface (Default)
      </Typography>
    </div>
  ),
  args: {
    variant: "bodyLarge",
    children: "Colored Text",
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Card } from ".";
import { Grid, GridItem, GridRow } from "../Grid";

const meta = {
  component: Card,
  args: {
    headline: "Headline",
    subhead: "Subhead",
    supportingText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image:
      "https://placehold.jp/300x200.png?text=Image&css=%7B%22background-color%22%3A%22%23B0C4DE%22%2C%22color%22%3A%22%23000000%22%7D",
    media: {
      image:
        "https://placehold.jp/600x300.png?text=Media+Image&css=%7B%22background-color%22%3A%22%23E6E6FA%22%2C%22color%22%3A%22%23000000%22%7D",
      alt: "Placeholder image",
    },
    actions: [
      { label: "Action 1", onClick: () => alert("Action 1 clicked") }, // onPress を onClick に変更
      {
        label: "Action 2",
        onClick: () => alert("Action 2 clicked"), // onPress を onClick に変更
        variant: "primary",
      },
    ],
  },
  argTypes: {
    headline: { control: "text" },
    subhead: { control: "text" },
    supportingText: { control: "text" },
    image: { control: "text" }, // For deprecated prop
    media: { control: "object" },
    actions: { control: "object" },
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"],
    },
    children: { control: "text" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderAllVariants = (args: Story["args"], headlinePrefix = "") => (
  <Grid>
    <GridRow>
      <GridItem colSpan={4}>
        <Card
          {...args}
          variant="elevated"
          headline={`${headlinePrefix}Elevated Card`}
          style={{ height: "100%" }}
        />
      </GridItem>
      <GridItem colSpan={4}>
        <Card
          {...args}
          variant="outlined"
          headline={`${headlinePrefix}Outlined Card`}
          style={{ height: "100%" }}
        />
      </GridItem>
      <GridItem colSpan={4}>
        <Card
          {...args}
          variant="filled"
          headline={`${headlinePrefix}Filled Card`}
          style={{ height: "100%" }}
        />
      </GridItem>
    </GridRow>
  </Grid>
);

export const Default: Story = {
  name: "Default (All Variants)",
  render: (args) => renderAllVariants(args),
  args: {
    // Default args from meta are used here
  },
};

export const WithMediaAndActions: Story = {
  name: "With Media & Actions (All Variants)",
  render: (args) => renderAllVariants(args, "Media & Actions: "),
  args: {
    headline: "Card with Media",
    subhead: "And some actions",
    supportingText: undefined,
    media: {
      image:
        "https://placehold.jp/350x200.png?text=Media&css=%7B%22background-color%22%3A%22%23D8BFD8%22%2C%22color%22%3A%22%23000000%22%7D",
      alt: "Media placeholder",
    },
    actions: [
      {
        label: "Confirm",
        onClick: () => alert("Confirmed"), // onPress を onClick に変更
        variant: "primary",
      },
      { label: "Cancel", onClick: () => alert("Cancelled") }, // onPress を onClick に変更
    ],
    image: undefined,
  },
};

export const WithCustomChildren: Story = {
  name: "With Custom Children (All Variants)",
  render: (args) => renderAllVariants(args, "Custom Children: "),
  args: {
    headline: "Card with Children",
    subhead: "Render custom content inside",
    supportingText: undefined,
    media: undefined,
    actions: undefined,
    image: undefined,
    children: (
      <div
        style={{
          padding: "16px",
          backgroundColor: "lightgoldenrodyellow",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p>This is custom children content!</p>
        <button type="button">A custom button</button>
      </div>
    ),
  },
};

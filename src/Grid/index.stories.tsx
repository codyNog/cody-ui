import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Grid } from ".";

const meta: Meta = {
  title: "Grid",
};

export default meta;

type Story = StoryObj;

// カードコンポーネントを共通化
type CardProps = {
  span?: number;
  bgColor?: string;
  height?: string;
  children: ReactNode;
};

const Card = ({ span, bgColor = "var(--md-sys-color-primary-container)", height, children }: CardProps) => (
  <Grid.Column span={span}>
    <div
      style={{
        background: bgColor,
        padding: "16px",
        borderRadius: "8px",
        height: height,
      }}
    >
      {children}
    </div>
  </Grid.Column>
);

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Basic Grid Layout</h2>
      <Grid.Container>
        <Grid.Row>
          <Card span={6}>Column 1 (span 6)</Card>
          <Card span={6}>Column 2 (span 6)</Card>
        </Grid.Row>
      </Grid.Container>
      
      <h2 style={{ marginTop: "32px" }}>Responsive Grid Layout</h2>
      <Grid.Container>
        <Grid.Row>
          <Card bgColor="var(--md-sys-color-secondary-container)">Auto Column 1</Card>
          <Card bgColor="var(--md-sys-color-secondary-container)">Auto Column 2</Card>
          <Card bgColor="var(--md-sys-color-secondary-container)">Auto Column 3</Card>
          <Card bgColor="var(--md-sys-color-secondary-container)">Auto Column 4</Card>
        </Grid.Row>
      </Grid.Container>
      
      <h2 style={{ marginTop: "32px" }}>Bento Layout</h2>
      <Grid.Container>
        <Grid.Row>
          <Card span={8} bgColor="var(--md-sys-color-tertiary-fixed)" height="200px">
            Main Content (span 8)
          </Card>
          <Card span={4} bgColor="var(--md-sys-color-tertiary-fixed)" height="200px">
            Sidebar (span 4)
          </Card>
          <Card span={4} bgColor="var(--md-sys-color-tertiary-fixed)" height="150px">
            Card 1 (span 4)
          </Card>
          <Card span={4} bgColor="var(--md-sys-color-tertiary-fixed)" height="150px">
            Card 2 (span 4)
          </Card>
          <Card span={4} bgColor="var(--md-sys-color-tertiary-fixed)" height="150px">
            Card 3 (span 4)
          </Card>
        </Grid.Row>
      </Grid.Container>
    </div>
  ),
};

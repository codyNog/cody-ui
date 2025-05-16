import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from ".";

const meta = {
  component: TimePicker,
  args: {
    label: "Time",
  },
} satisfies Meta<typeof TimePicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    // @ts-expect-error storybook
    value: { hour: 14, minute: 30 }, // PM 2:30 (24-hour format for internal value)
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    // isReadOnly is no longer a prop, TextField is always read-only
  },
};

export const Required: Story = {
  args: {
    isRequired: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessage: "This is an error message.",
  },
};

export const GranularityMinute: Story = {
  args: {
    label: "Time (Minute Granularity, 12-hour cycle)",
    granularity: "minute",
    hourCycle: 12, // 12時間制を指定
    // @ts-expect-error storybook
    value: { hour: 10, minute: 45 }, // AM 10:45
  },
};

export const HourCycle12WithValue: Story = {
  args: {
    label: "Time (12-hour cycle with PM value)",
    hourCycle: 12,
    // @ts-expect-error storybook
    value: { hour: 22, minute: 15 }, // PM 10:15 (24-hour format for internal value)
  },
};

export const HourCycle24: Story = {
  args: {
    label: "Time (24-hour cycle)",
    hourCycle: 24,
    // @ts-expect-error storybook
    value: { hour: 17, minute: 50 },
  },
};

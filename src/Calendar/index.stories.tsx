import { type DateValue, getLocalTimeZone } from "@internationalized/date"; // Import DateValue and getLocalTimeZone
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from ".";

const meta = {
  component: Calendar,
  args: {
    variant: "single", // デフォルトでsingleを指定
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date()); // Use Date for state

    // ラッパー関数を作成して型を合わせる
    const handleChange = (newDate: Date | null) => {
      setDate(newDate || undefined);
    };

    return (
      <Calendar
        variant="single"
        {...args}
        value={date}
        onChange={handleChange}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    variant: "single",
    isDisabled: true,
    defaultValue: new Date(), // Use Date for defaultValue
  },
};

export const ReadOnly: Story = {
  args: {
    variant: "single",
    isReadOnly: true,
    defaultValue: new Date(), // Use Date for defaultValue
  },
};

export const UnavailableDates: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date(2024, 5, 10)); // June 10, 2024

    // ラッパー関数を作成して型を合わせる
    const handleChange = (newDate: Date | null) => {
      setDate(newDate || undefined);
    };

    // isDateUnavailable expects DateValue. Convert to Date to check day.
    const isDateUnavailable = (d: DateValue) => {
      const dateInLocalTz = d.toDate(getLocalTimeZone());
      const day = dateInLocalTz.getDay(); // Use getDay() on standard Date (Sunday=0, Saturday=6)
      return day === 0 || day === 6;
    };

    return (
      <Calendar
        variant="single"
        {...args}
        value={date}
        onChange={handleChange}
        isDateUnavailable={isDateUnavailable} // Pass the function
      />
    );
  },
  args: {
    variant: "single",
  },
};

// 範囲選択のStory
export const Range: Story = {
  render: (args) => {
    // Use Date[] for state, matching the new ExternalDateRange type
    const [dateRange, setDateRange] = useState<Date[] | undefined>([
      new Date(2024, 5, 10), // June 10, 2024
      new Date(2024, 5, 15), // June 15, 2024
    ]);

    // onChange now receives Date[] | null directly
    const handleChange = (newRange: Date[] | null) => {
      setDateRange(newRange || undefined);
    };

    return (
      <Calendar
        variant="range"
        {...args}
        value={dateRange}
        onChange={handleChange}
      />
    );
  },
  args: {
    variant: "range",
  },
};

// 複数選択のStory
export const Multiple: Story = {
  render: (args) => {
    const [dates, setDates] = useState<Date[]>([
      new Date(2024, 5, 10), // June 10, 2024
      new Date(2024, 5, 15), // June 15, 2024
      new Date(2024, 5, 20), // June 20, 2024
    ]);

    // ラッパー関数を作成して型を合わせる
    const handleChange = (newDates: Date[]) => {
      setDates(newDates);
    };

    return (
      <Calendar
        variant="multiple"
        {...args}
        value={dates}
        onChange={handleChange}
      />
    );
  },
  args: {
    variant: "multiple",
  },
};

// 全てのvariantを並べて表示するStory
export const AllVariants: Story = {
  render: () => {
    // Single
    const [date, setDate] = useState<Date | undefined>(new Date());
    const handleSingleChange = (newDate: Date | null) => {
      setDate(newDate || undefined);
    };

    // Range
    // Use Date[] for state
    const [dateRange, setDateRange] = useState<Date[] | undefined>([
      new Date(2024, 5, 10),
      new Date(2024, 5, 15),
    ]);
    // onChange now receives Date[] | null
    const handleRangeChange = (newRange: Date[] | null) => {
      setDateRange(newRange || undefined);
    };

    // Multiple
    const [dates, setDates] = useState<Date[]>([
      new Date(2024, 5, 10),
      new Date(2024, 5, 15),
      new Date(2024, 5, 20),
    ]);
    const handleMultipleChange = (newDates: Date[]) => {
      setDates(newDates);
    };

    return (
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <h3>Single</h3>
          <Calendar
            variant="single"
            value={date}
            onChange={handleSingleChange}
          />
        </div>
        <div>
          <h3>Range</h3>
          <Calendar
            variant="range"
            value={dateRange}
            onChange={handleRangeChange}
          />
        </div>
        <div>
          <h3>Multiple</h3>
          <Calendar
            variant="multiple"
            value={dates}
            onChange={handleMultipleChange}
          />
        </div>
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedButtons } from ".";
import { MdFavorite, MdHome, MdInfo, MdSearch, MdSettings } from "../Icons"; // Using Material Design Icons from src/Icons

const meta = {
  component: SegmentedButtons,
  args: {
    "aria-label": "Segmented Buttons Example",
  },
  //decorators: [ // Optional: Add a decorator for centering or padding if needed
  //  (Story) => <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Story /></div>,
  //],
} satisfies Meta<typeof SegmentedButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  { label: "Option 1", value: "opt1" },
  { label: "Option 2", value: "opt2" },
  { label: "Option 3", value: "opt3" },
];

const itemsWithIcons = [
  { label: "Home", value: "home", icon: <MdHome /> },
  { label: "Search", value: "search", icon: <MdSearch /> },
  { label: "Settings", value: "settings", icon: <MdSettings /> },
];

// No longer a dummy, but a placeholder if not overridden by a specific story's render
const onChangePlaceholder = () =>
  console.log("onChange triggered from placeholder");

export const Default: Story = {
  args: {
    items: defaultItems,
    mode: "single",
    value: "opt1", // Added for type consistency
    defaultValue: "opt1",
  },
  render: function Render(args) {
    if (args.mode === "single") {
      const initialValue =
        typeof args.defaultValue === "string" ? args.defaultValue : "opt1";
      const [value, setValue] = useState(initialValue);
      return (
        <SegmentedButtons
          {...args}
          mode="single" // Explicitly pass mode
          value={value}
          defaultValue={initialValue} // Pass defaultValue consistent with mode
          onChange={(newValue: string) => {
            setValue(newValue);
            console.log("Single select changed:", newValue);
          }}
        />
      );
    }
    // Should not happen based on story args, but as a fallback or for type safety:
    return <div>Invalid mode for this story setup.</div>;
  },
};

export const SingleSelect: Story = {
  args: {
    items: defaultItems,
    mode: "single",
    value: "opt2", // Added for type consistency
    defaultValue: "opt2",
    "aria-label": "Single Select Segmented Buttons",
  },
  render: function Render(args) {
    if (args.mode === "single") {
      const initialValue =
        typeof args.defaultValue === "string" ? args.defaultValue : "opt2";
      const [value, setValue] = useState(initialValue);
      return (
        <SegmentedButtons
          {...args}
          mode="single"
          value={value}
          defaultValue={initialValue}
          onChange={(newValue: string) => {
            setValue(newValue);
            console.log("Single select changed:", newValue);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

export const MultipleSelect: Story = {
  args: {
    items: defaultItems,
    mode: "multiple",
    value: ["opt1", "opt3"], // Added for type consistency
    defaultValue: ["opt1", "opt3"],
    "aria-label": "Multiple Select Segmented Buttons",
  },
  render: function Render(args) {
    if (args.mode === "multiple") {
      const initialValues = Array.isArray(args.defaultValue)
        ? args.defaultValue
        : ["opt1", "opt3"];
      const [values, setValues] = useState<string[]>(initialValues);
      return (
        <SegmentedButtons
          {...args}
          mode="multiple"
          value={values}
          defaultValue={initialValues}
          onChange={(newValues: string[]) => {
            setValues(newValues);
            console.log("Multiple select changed:", newValues);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    mode: "single",
    value: "home", // Added for type consistency
    defaultValue: "home",
    "aria-label": "Segmented Buttons With Icons",
  },
  render: function Render(args) {
    if (args.mode === "single") {
      const initialValue =
        typeof args.defaultValue === "string" ? args.defaultValue : "home";
      const [value, setValue] = useState(initialValue);
      return (
        <SegmentedButtons
          {...args}
          mode="single"
          value={value}
          defaultValue={initialValue}
          onChange={(newValue: string) => {
            setValue(newValue);
            console.log("WithIcons changed:", newValue);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

export const WithIconsMultiple: Story = {
  args: {
    items: itemsWithIcons,
    mode: "multiple",
    value: ["search", "settings"], // Added for type consistency
    defaultValue: ["search", "settings"],
    "aria-label": "Multiple Select Segmented Buttons With Icons",
  },
  render: function Render(args) {
    if (args.mode === "multiple") {
      const initialValues = Array.isArray(args.defaultValue)
        ? args.defaultValue
        : ["search", "settings"];
      const [values, setValues] = useState<string[]>(initialValues);
      return (
        <SegmentedButtons
          {...args}
          mode="multiple"
          value={values}
          defaultValue={initialValues}
          onChange={(newValues: string[]) => {
            setValues(newValues);
            console.log("WithIconsMultiple changed:", newValues);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

// For disabled states, interactivity is not the primary concern,
// so we can keep them as uncontrolled or controlled with fixed values.
export const DisabledGroup: Story = {
  args: {
    items: defaultItems,
    mode: "single",
    value: "opt1",
    defaultValue: "opt1",
    onChange: onChangePlaceholder, // Keep a placeholder for consistency
    disabled: true,
    "aria-label": "Disabled Segmented Buttons Group",
  },
};

export const DisabledItem: Story = {
  args: {
    items: [
      { label: "Enabled", value: "enabled" },
      { label: "Disabled", value: "disabled", disabled: true },
      { label: "Another Enabled", value: "another" },
    ],
    mode: "single",
    value: "enabled",
    defaultValue: "enabled",
    onChange: onChangePlaceholder, // Keep a placeholder
    "aria-label": "Segmented Buttons With a Disabled Item",
  },
};

export const FiveOptionsWithIcons: Story = {
  args: {
    items: [
      { label: "Home", value: "home", icon: <MdHome /> },
      { label: "Search", value: "search", icon: <MdSearch /> },
      { label: "Favorite", value: "favorite", icon: <MdFavorite /> },
      { label: "Settings", value: "settings", icon: <MdSettings /> },
      { label: "Info", value: "info", icon: <MdInfo /> },
    ],
    mode: "multiple",
    value: ["home", "favorite"], // Added for type consistency
    defaultValue: ["home", "favorite"],
    "aria-label": "Segmented Buttons with Five Options and Icons",
  },
  render: function Render(args) {
    if (args.mode === "multiple") {
      const initialValues = Array.isArray(args.defaultValue)
        ? args.defaultValue
        : ["home", "favorite"];
      const [values, setValues] = useState<string[]>(initialValues);
      return (
        <SegmentedButtons
          {...args}
          mode="multiple"
          value={values}
          defaultValue={initialValues}
          onChange={(newValues: string[]) => {
            setValues(newValues);
            console.log("FiveOptionsWithIcons changed:", newValues);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

export const TwoOptions: Story = {
  args: {
    items: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    mode: "single",
    value: "yes", // Added for type consistency
    defaultValue: "yes",
    "aria-label": "Two Option Segmented Buttons",
  },
  render: function Render(args) {
    if (args.mode === "single") {
      const initialValue =
        typeof args.defaultValue === "string" ? args.defaultValue : "yes";
      const [value, setValue] = useState(initialValue);
      return (
        <SegmentedButtons
          {...args}
          mode="single"
          value={value}
          defaultValue={initialValue}
          onChange={(newValue: string) => {
            setValue(newValue);
            console.log("TwoOptions changed:", newValue);
          }}
        />
      );
    }
    return <div>Invalid mode for this story setup.</div>;
  },
};

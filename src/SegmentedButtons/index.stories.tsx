import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedButtons } from ".";
import { MdHome, MdSettings, MdSearch, MdFavorite, MdInfo } from "../Icons"; // Using Material Design Icons from src/Icons

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
    // defaultValue: "opt1", // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [value, setValue] = useState("opt1");
    return (
      <SegmentedButtons
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log("Single select changed:", newValue);
        }}
      />
    );
  },
};

export const SingleSelect: Story = {
  args: {
    items: defaultItems,
    mode: "single",
    "aria-label": "Single Select Segmented Buttons",
    // defaultValue: "opt2", // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [value, setValue] = useState("opt2");
    return (
      <SegmentedButtons
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log("Single select changed:", newValue);
        }}
      />
    );
  },
};

export const MultipleSelect: Story = {
  args: {
    items: defaultItems,
    mode: "multiple",
    "aria-label": "Multiple Select Segmented Buttons",
    // defaultValue: ["opt1", "opt3"], // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>(["opt1", "opt3"]);
    return (
      <SegmentedButtons
        {...args}
        value={values}
        onChange={(newValues) => {
          setValues(newValues);
          console.log("Multiple select changed:", newValues);
        }}
      />
    );
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    mode: "single",
    "aria-label": "Segmented Buttons With Icons",
    // defaultValue: "home", // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [value, setValue] = useState("home");
    return (
      <SegmentedButtons
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log("WithIcons changed:", newValue);
        }}
      />
    );
  },
};

export const WithIconsMultiple: Story = {
  args: {
    items: itemsWithIcons,
    mode: "multiple",
    "aria-label": "Multiple Select Segmented Buttons With Icons",
    // defaultValue: ["search", "settings"], // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>(["search", "settings"]);
    return (
      <SegmentedButtons
        {...args}
        value={values}
        onChange={(newValues) => {
          setValues(newValues);
          console.log("WithIconsMultiple changed:", newValues);
        }}
      />
    );
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
    "aria-label": "Segmented Buttons with Five Options and Icons",
    // defaultValue: ["home", "favorite"], // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>(["home", "favorite"]);
    return (
      <SegmentedButtons
        {...args}
        value={values}
        onChange={(newValues) => {
          setValues(newValues);
          console.log("FiveOptionsWithIcons changed:", newValues);
        }}
      />
    );
  },
};

export const TwoOptions: Story = {
  args: {
    items: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    mode: "single",
    "aria-label": "Two Option Segmented Buttons",
    // defaultValue: "yes", // Use controlled component for interactivity
  },
  render: function Render(args) {
    const [value, setValue] = useState("yes");
    return (
      <SegmentedButtons
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          console.log("TwoOptions changed:", newValue);
        }}
      />
    );
  },
};

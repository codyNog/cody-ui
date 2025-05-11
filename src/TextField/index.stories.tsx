import type { Meta, StoryObj } from "@storybook/react";
import { type Dispatch, type SetStateAction, useState } from "react"; // Import React and types
import { MdCheck, MdSearch } from "../Icons"; // Import icons
import { TextField } from "./index"; // Import the main wrapper component

const meta = {
  component: TextField,
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined"],
    },
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    multiline: { control: "boolean" },
    maxLines: { control: "number" }, // Add maxLines control
    // placeholder は Input に直接渡されるため、argTypes から削除 (Storybook が自動検出するはず)
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url", "search"],
    },
    value: { control: "text" }, // Added value control for interactive story
  },
  args: {
    // Default args
    // variant is set per story now
    label: "Label",
    // placeholder is removed from args (set in individual stories if needed)
    isDisabled: false,
    isRequired: false,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Removed Filled and Outlined stories as variants are shown in other stories

export const WithDescription: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <TextField {...args} variant="filled" />
      <TextField {...args} variant="outlined" />
    </div>
  ),
  args: {
    label: "With Description",
    description: "This is a helpful description.",
  },
};

export const WithError: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <TextField {...args} variant="filled" />
      <TextField {...args} variant="outlined" />
    </div>
  ),
  args: {
    label: "With Error",
    errorMessage: "This field has an error.",
    // isInvalid is automatically handled by the component based on errorMessage
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <TextField {...args} variant="filled" />
      <TextField {...args} variant="outlined" />
    </div>
  ),
  args: {
    label: "Disabled",
    isDisabled: true,
    value: "Cannot edit",
  },
};

export const Required: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <TextField {...args} variant="filled" />
      <TextField {...args} variant="outlined" />
    </div>
  ),
  args: {
    label: "Required Field",
    isRequired: true,
  },
};

// Interactive story to demonstrate state handling for both variants
export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filledValue, setFilledValue] = useState(args.value || "");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [outlinedValue, setOutlinedValue] = useState(args.value || "");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filledError, setFilledError] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [outlinedError, setOutlinedError] = useState("");

    // Factory function to create change handlers for each variant
    const createHandleChange =
      (
        setValue: Dispatch<SetStateAction<string>>, // Remove React. prefix
        setError: Dispatch<SetStateAction<string>>, // Remove React. prefix
      ) =>
      (newValue: string) => {
        setValue(newValue);
        // Basic validation example
        if (args.isRequired && !newValue) {
          setError("This field is required.");
        } else if (
          args.type === "email" &&
          newValue &&
          !/\S+@\S+\.\S+/.test(newValue)
        ) {
          setError("Please enter a valid email address.");
        } else {
          setError(""); // Clear error if valid or not required/empty
        }
      };

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <TextField
          {...args}
          variant="filled" // Explicitly set variant
          value={filledValue}
          onChangeText={createHandleChange(setFilledValue, setFilledError)}
          errorMessage={filledError || args.errorMessage} // Show validation or storybook error
        />
        <TextField
          {...args}
          variant="outlined" // Explicitly set variant
          value={outlinedValue}
          onChangeText={createHandleChange(setOutlinedValue, setOutlinedError)}
          errorMessage={outlinedError || args.errorMessage} // Show validation or storybook error
        />
      </div>
    );
  },
  args: {
    label: "Interactive",
    value: "Initial Value", // Start with an initial value if needed
  },
};

// Interactive Story for multiline text field
export const MultilineInteractive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filledValue, setFilledValue] = useState(args.value || "");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [outlinedValue, setOutlinedValue] = useState(args.value || "");

    // No complex validation needed here, just update state
    const createHandleChange =
      (
        setValue: Dispatch<SetStateAction<string>>, // Remove React. prefix
      ) =>
      (newValue: string) => {
        setValue(newValue);
      };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        <TextField
          {...args} // Pass all args like maxLines, label etc.
          variant="filled"
          value={filledValue}
          onChangeText={createHandleChange(setFilledValue)}
          // Ensure multiline is explicitly true for this story's render
          multiline={true}
        />
        <TextField
          {...args} // Pass all args like maxLines, label etc.
          variant="outlined"
          value={outlinedValue}
          onChangeText={createHandleChange(setOutlinedValue)}
          // Ensure multiline is explicitly true for this story's render
          multiline={true}
        />
      </div>
    );
  },
  args: {
    label: "Multiline Interactive",
    multiline: true, // Default multiline to true for this story
    maxLines: 3, // Default maxLines example
    value: "",
  },
};

// Story to demonstrate start and end adornments
export const WithAdornments: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
      <TextField
        {...args}
        variant="filled"
        startAdornment="$" // Example start adornment (text)
        endAdornment="kg" // Example end adornment (text)
      />
      <TextField
        {...args}
        variant="outlined"
        // Example using potentially different adornments
        startAdornment={<MdSearch />} // Example start adornment (icon-like)
        endAdornment={<MdCheck />} // Example end adornment (icon-like)
      />
    </div>
  ),
  args: {
    label: "With Adornments",
    // value: "100", // Optional initial value
  },
};

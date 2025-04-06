import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio, RadioGroup } from "./index";

// Keep meta concise as per .clinerules
const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  args: {
    label: "Favorite Pet", // Default args for controls
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// --- Stories ---

/** Default RadioGroup story with state management */
export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("dog");
    return (
      <RadioGroup
        {...args}
        value={selected}
        onChange={setSelected} // Use standard onChange prop from react-aria-components
      >
        <Radio value="dog">Dog</Radio>
        <Radio value="cat">Cat</Radio>
        <Radio value="dragon">Dragon</Radio>
      </RadioGroup>
    );
  },
};

/** RadioGroup with a pre-selected value */
export const PreSelected: Story = {
  args: {
    defaultValue: "cat", // Use defaultValue for initial uncontrolled state
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dog">Dog</Radio>
      <Radio value="cat">Cat</Radio>
      <Radio value="dragon">Dragon</Radio>
    </RadioGroup>
  ),
};

/** Disabled RadioGroup */
export const DisabledGroup: Story = {
  args: {
    isDisabled: true,
    defaultValue: "cat",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dog">Dog</Radio>
      <Radio value="cat">Cat</Radio>
      <Radio value="dragon">Dragon</Radio>
    </RadioGroup>
  ),
};

/** RadioGroup with one disabled option */
export const DisabledOption: Story = {
  args: {
    defaultValue: "dog",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dog">Dog</Radio>
      <Radio value="cat" isDisabled>
        Cat (Disabled)
      </Radio>
      <Radio value="dragon">Dragon</Radio>
    </RadioGroup>
  ),
};

/** Multiple RadioGroups side-by-side */
export const MultipleGroups: Story = {
  render: () => {
    const [pet, setPet] = useState("cat");
    const [food, setFood] = useState("pizza");
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "40px" }}>
        <RadioGroup
          label="Favorite Pet"
          value={pet}
          onChange={setPet}
          aria-label="Favorite Pet Group" // Add aria-label when label prop is visual only
        >
          <Radio value="dog">Dog</Radio>
          <Radio value="cat">Cat</Radio>
          <Radio value="dragon">Dragon</Radio>
        </RadioGroup>
        <RadioGroup
          label="Favorite Food"
          value={food}
          onChange={setFood}
          aria-label="Favorite Food Group"
        >
          <Radio value="pizza">Pizza</Radio>
          <Radio value="sushi">Sushi</Radio>
          <Radio value="tacos" isDisabled>
            Tacos (Not available)
          </Radio>
        </RadioGroup>
      </div>
    );
  },
};

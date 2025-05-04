import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup } from "./index";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  args: {
    label: "Favorite Pet",
    options: [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "dragon", label: "Dragon" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("dog");
    const options = args.options ?? [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "dragon", label: "Dragon" },
    ];
    return (
      <RadioGroup
        {...args}
        value={selected}
        onChange={setSelected}
        options={options}
      />
    );
  },
};

export const PreSelected: Story = {
  args: {
    defaultValue: "cat",
  },
  render: (args) => <RadioGroup {...args} />,
};

export const DisabledGroup: Story = {
  args: {
    isDisabled: true,
    defaultValue: "cat",
  },
  render: (args) => <RadioGroup {...args} />,
};
// Story for demonstrating an individual disabled option via the options prop
export const DisabledOption: Story = {
  args: {
    defaultValue: "dog",
    options: [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat (Disabled)", isDisabled: true },
      { value: "dragon", label: "Dragon" },
    ],
  },
  render: (args) => <RadioGroup {...args} />,
};

export const MultipleGroups: Story = {
  render: () => {
    const [pet, setPet] = useState("cat");
    const [food, setFood] = useState("pizza");
    const petOptions = [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "dragon", label: "Dragon" },
    ];
    const foodOptions = [
      { value: "pizza", label: "Pizza" },
      { value: "sushi", label: "Sushi" },
      { value: "tacos", label: "Tacos (Disabled)", isDisabled: true },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "40px" }}>
        <RadioGroup
          label="Favorite Pet"
          value={pet}
          onChange={setPet}
          options={petOptions}
        />
        <RadioGroup
          label="Favorite Food"
          value={food}
          onChange={setFood}
          options={foodOptions}
        />
      </div>
    );
  },
};

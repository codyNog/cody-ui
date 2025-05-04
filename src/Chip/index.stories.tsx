import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { Chip as Component } from "."; // ChipProps のインポートを削除
import { getCanvas } from "../libs/storybook";

// StoryArgs 型エイリアスを削除

const meta: Meta<typeof Component> = {
  // 型を typeof Component に戻す
  component: Component,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["assist", "filter", "input", "suggestion"],
    },
    isDisabled: {
      control: { type: "boolean" },
    },
    isSelected: {
      control: { type: "boolean" },
      if: { arg: "variant", eq: "filter" },
    },
    children: { control: "text" },
    // アイコンコントロールは削除済み
  },
  // デフォルト引数 (assist variant を想定)
  args: {
    variant: "assist",
    children: "Chip Label",
    isDisabled: false,
    leadingIcon: undefined,
    // trailingIcon と isSelected は assist では使えないので含めない
  },
};

export default meta;

type Story = StoryObj<typeof Component>; // 型を typeof Component に戻す

// デフォルト表示のストーリー (assist)
export const Default: Story = {
  // args は meta から継承 (assist)
  render: (args) => <Component {...args} />,
};

// 全てのバリアントを表示するストーリー
export const Variants: Story = {
  // render 内で variant ごとに正しい props を渡す
  render: (args) => {
    // args から variant 固有の props を分離 (isSelected は filter のみ)
    const {
      children,
      leadingIcon,
      isDisabled,
      onPress,
      "aria-label": ariaLabel,
      trailingIcon,
    } = args;
    // assist 用の props (trailingIcon なし)
    const assistProps = {
      children,
      leadingIcon,
      isDisabled,
      onPress,
      "aria-label": ariaLabel,
      variant: "assist" as const,
    };
    // filter 用の props (isSelected なし、trailingIcon あり)
    const filterProps = {
      children,
      leadingIcon,
      isDisabled,
      onPress,
      "aria-label": ariaLabel,
      variant: "filter" as const,
      isSelected: false,
      trailingIcon,
    };
    // input 用の props (isSelected なし、trailingIcon あり)
    const inputProps = {
      children,
      leadingIcon,
      isDisabled,
      onPress,
      "aria-label": ariaLabel,
      variant: "input" as const,
      trailingIcon,
    };
    // suggestion 用の props (isSelected なし、trailingIcon あり)
    const suggestionProps = {
      children,
      leadingIcon,
      isDisabled,
      onPress,
      "aria-label": ariaLabel,
      variant: "suggestion" as const,
      trailingIcon,
    };

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <Component {...assistProps}>Assist</Component>
        <Component {...filterProps}>Filter (Unselected)</Component>
        <Component {...inputProps}>Input</Component>
        <Component {...suggestionProps}>Suggestion</Component>
      </div>
    );
  },
};

// Filterチップの選択状態を表示するストーリー
export const FilterSelected: Story = {
  args: {
    variant: "filter", // variant を filter に設定
    isSelected: true,
    children: "Filter (Selected)",
    leadingIcon: undefined,
    trailingIcon: undefined, // 選択時は通常表示しない想定
    isDisabled: false,
  },
  render: (args) => <Component {...args} />,
};

// 無効状態のストーリー
export const Disabled: Story = {
  args: {
    // isDisabled 以外の共通 args を設定 (variant は render で指定)
    children: "Disabled",
    leadingIcon: undefined,
    isDisabled: true,
    // trailingIcon は variant によって必要かどうかが変わるため render で設定
  },
  render: (args) => {
    const { children, leadingIcon, isDisabled } = args;
    // assist 用
    const assistProps = {
      children,
      leadingIcon,
      isDisabled,
      variant: "assist" as const,
    };
    // filter 用 (isSelected=false)
    const filterUnselectedProps = {
      children,
      leadingIcon,
      isDisabled,
      variant: "filter" as const,
      isSelected: false,
      trailingIcon: "x",
    };
    // filter 用 (isSelected=true)
    const filterSelectedProps = {
      children,
      leadingIcon,
      isDisabled,
      variant: "filter" as const,
      isSelected: true,
      trailingIcon: "x",
    };
    // input 用
    const inputProps = {
      children,
      leadingIcon,
      isDisabled,
      variant: "input" as const,
      trailingIcon: "x",
    };
    // suggestion 用
    const suggestionProps = {
      children,
      leadingIcon,
      isDisabled,
      variant: "suggestion" as const,
      trailingIcon: "x",
    };

    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <Component {...assistProps} />
        <Component {...filterUnselectedProps} />
        <Component {...filterSelectedProps} />
        <Component {...inputProps} />
        <Component {...suggestionProps} />
      </div>
    );
  },
};

// Behaviorストーリー
export const Behavior: Story = {
  args: {
    // assist variant を想定
    variant: "assist",
    children: "Click Me",
    isDisabled: false,
    leadingIcon: undefined,
  },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = getCanvas(canvasElement);
    expect(canvas).toBeTruthy();
  },
};

import { within } from "@storybook/test";

export const getCanvas = (canvasElement: HTMLElement) => {
  const parent = canvasElement.parentElement;
  if (!parent) {
    throw new Error("Canvas element does not have a parent element.");
  }
  return within(parent);
};

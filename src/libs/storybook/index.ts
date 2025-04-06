import { within } from "@storybook/test";

export const getCanvas = (canvasElement: HTMLElement) => {
  const parent = canvasElement.parentElement;
  if (!parent) {
    // Handle the case where parentElement is null, removing the need for @ts-ignore
    throw new Error("Canvas element does not have a parent element.");
  }
  // parent is guaranteed to be HTMLElement here
  return within(parent);
};

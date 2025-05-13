import { within } from "@storybook/test";

/**
 * Retrieves the Storybook canvas element for interaction testing.
 * Storybook's `canvasElement` often refers to an internal wrapper,
 * not the actual root element of the story. This utility function
 * navigates to the parent element, which is typically the correct
 * scope for `within` queries.
 *
 * @param {HTMLElement} canvasElement - The canvasElement provided by Storybook play function.
 * @returns {ReturnType<typeof within>} The testing-library `within` scope for the story's root.
 * @throws {Error} If the canvasElement does not have a parent element.
 *
 * @example
 * ```ts
 * import { expect } from '@storybook/test';
 * import { getCanvas } from './storybook-utils'; // Adjust path as needed
 *
 * export const MyStory = {
 *   play: async ({ canvasElement }) => {
 *     const canvas = getCanvas(canvasElement);
 *     const button = await canvas.findByRole('button', { name: /Click Me/i });
 *     await expect(button).toBeInTheDocument();
 *   },
 * };
 * ```
 */
export const getCanvas = (canvasElement: HTMLElement) => {
  const parent = canvasElement.parentElement;
  if (!parent) {
    throw new Error("Canvas element does not have a parent element.");
  }
  return within(parent);
};

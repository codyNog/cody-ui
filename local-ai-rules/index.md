## Repository Overview: @codynog/cody-ui

This repository contains the `@codynog/cody-ui` React component library.

### Purpose

To provide reusable UI components for efficient development.

### Key Technologies

- React & TypeScript
- CSS Modules (`*.module.css`)
- Material Design 3 (via `@material/material-color-utilities`)
- Storybook (Component catalog & testing)
- Vite (Build tool)
- Vitest (Testing framework)
- Biome (Formatter & Linter)
- Plop (Component scaffolding)
- react-aria-components (Accessibility)

### Core Features

- UI Components: Reusable components located in `src/` (e.g., `Button`).
- Storybook: Run `npm run storybook` or `npm run dev` to view components ([Public Storybook](https://cody-rn-ui.pages.dev/)). Theme settings likely in `.storybook/preview.ts`.
- Component Generation: Use `npm run plop` to scaffold new components from `plop-templates/`.
- Code Quality: Enforced by Biome (`npm run format`, `npm run lint`) and TypeScript (`npm run type-check`).
- Testing: Unit tests via Vitest (`vitest`).
- CLI: Potential command-line functionality via `cli.ts`.

### Important Locations

- Components: `src/`
- Component Templates: `plop-templates/`
- Global Styles: `src/global.css`
- Storybook Config: `.storybook/`
- Build/Test Config: `vite.config.ts`, `vitest.config.ts`
- Lint/Format Config: `biome.json`
- TypeScript Config: `tsconfig.json`
- Scaffolding Config: `plopfile.cjs`

### Additional Notes

- Published on GitHub Packages as `@codynog/cody-ui`.
- Includes optional AI rules via `@codynog/ai-rules`.

### Design Principles

- Adhere strictly to the principles and guidelines of Material Design 3 (M3) ([https://m3.material.io/](https://m3.material.io/)) for visual consistency, functionality, and feature completeness. Implement all standard M3 features and variants by default unless explicitly specified otherwise.
- Utilize `react-aria-components` as the primary foundation for building new UI components to ensure accessibility best practices, unless explicitly instructed otherwise.

### Component API Design

- Use standard HTML attribute names for common events (e.g., `onClick`). For component-specific callbacks, use descriptive names reflecting the functionality (e.g., `onChangeValue`).
- Define component props explicitly. Prefer composition or explicit pass-through props for extending functionality over directly extending generic HTML attribute types.

### Code Generation

- Use the specific format `npm run plop ui ComponentName` (e.g., `npm run plop ui Foo`) for generating new UI components.

### Storybook

- Arrange multiple component variants horizontally using `display: flex; flexDirection: row;` when displaying them in a single story.
- Keep the `meta` object in Storybook stories concise. Include only the `component` and `args` (or `argTypes`) properties unless there's a specific reason for additional configuration.

### Code Modification Practices

- Maintain code clarity by removing unused code, including import statements and commented-out blocks. **Proactively remove all commented-out code.** Retain commented code **only** when there is a **clear, documented justification** immediately preceding or within the comment block explaining *why* it must be kept temporarily (e.g., 'Workaround for bug #123, remove after fix'). If unsure whether a commented block meets this strict criteria, **ask the user** before leaving it in the codebase.
- Use named imports when importing modules.
- Keep import statements clean and free of comments.
- When editing an existing component, modify the files in the following order: CSS module (`*.module.css`) -> Component file (`*.tsx`) -> Story file (`*.stories.tsx`).

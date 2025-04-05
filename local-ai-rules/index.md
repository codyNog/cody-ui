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

- Adhere to the principles and guidelines of Material Design 3 (M3) for visual consistency and user experience.

# React Native UI Component Library - Project Overview

This project is a cross-platform React Native UI component library utilizing Tamagui. It is based on Material Design 3 design principles and implemented in TypeScript.

## Project Structure

- `src/` - All components are located here
  - Each component has its own directory containing `index.tsx` and `index.stories.tsx`
  - Components are copied to their destination for use, so exports from `src/index.ts` are not required
- `src/theme/` - Theme-related files (Material Design 3 based)
  - `src/theme/index.ts` - Theme variable definitions
- `src/libs/` - Utility libraries
- `plop-templates/` - Templates for component generation

## Design System

- **Base**: Compliant with Material Design 3 themes and guidelines
- **Color Palette**: Adopts Material Design 3 color system
- **Future Plans**: Planning to transition to a custom design system

## Development Guidelines

### Coding Conventions

- Implementation using TypeScript
- Arrow Functions are recommended
- Lint and Format applied with Biome
- Avoid using 'any' as much as possible
- Use named imports

### Testing

- Verify component behavior using Storybook Play Functions
- Write tests from a Behavior Driven Development (BDD) perspective

### Component Development

- Create new components: `npm run plop ui <ComponentName>`
  - Example: `npm run plop ui Button` → Generates `src/Button/index.tsx` and `src/Button/index.stories.tsx`
- Each component should operate independently and be reusable
- Use `@tamagui/lucide-icons` for icons

## Development Workflow

### Environment Setup

```bash
# Install dependencies
npm install
```

### Launch Development Server

```bash
# Start Storybook
npm run dev
# → Accessible at http://localhost:6006
```

### Run Tests

```bash
# Execute tests
npm run test
```

## Notes

- Visually verify component changes in Storybook
- Create corresponding stories when adding new features
- Properly define TypeScript types

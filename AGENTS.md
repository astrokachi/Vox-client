# AGENTS.md — x-bot-client

## Project Overview

React 19 + React Router v7 (file-based routing) SPA with Vite 7, TypeScript strict mode, and global SCSS styling.

## Commands

```bash
pnpm dev       # Start dev server (Vite + React Router)
pnpm build     # Type-check + build for production (tsc -b && react-router-serve)
pnpm lint      # Run ESLint on all .ts/.tsx files
pnpm preview   # Preview production build via Vite
```

**No test framework is installed.** There are no test files, test scripts, or testing dependencies. If adding tests, use Vitest + React Testing Library (matches Vite setup).

To run a single test (once testing is set up):
```bash
pnpm vitest run path/to/test.test.tsx
```

## Code Style

### Imports

- Use `~/*` path alias for imports under `app/` (configured in `tsconfig.json`):
  ```ts
  import Button from "~/components/button";
  import { useToast } from "~/hooks/useToast";
  import "~/styles/components/button.scss";
  ```
- Use relative imports for sibling/nearby files:
  ```ts
  import { SidebarNavItems } from './SidebarNavItems';
  ```
- Import order: React/framework → third-party → `~/*` aliases → relative imports.
- Use `verbatimModuleSyntax` — all type-only imports must use `import type`:
  ```ts
  import type { ToastContextType } from "~/contexts/toast-context";
  ```

### Formatting

- ESLint flat config with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- No Prettier configured. Follow existing code formatting in the repo.
- Single quotes for strings, semicolons present (follow existing file conventions).

### TypeScript

- **Strict mode enabled.** No `any` unless absolutely necessary.
- Props defined with `interface`, not `type`:
  ```ts
  interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }
  ```
- Route loader/action args use auto-generated types: `Route.LoaderArgs`, `Route.ActionArgs`.
- Error boundary uses `Route.ErrorBoundaryProps`.

### Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Component files | kebab-case | `button.tsx` |
| Component names | PascalCase | `Button`, `MetricsGrid` |
| Hook files | camelCase with `use` prefix | `useToast.ts` |
| Hook names | camelCase, `use` prefix | `useToast` |
| Context files | kebab-case | `toast-context.tsx`, `toast-provider.tsx` |
| SCSS files | kebab-case | `metric-card.scss` |
| Variables/functions | camelCase | `addToast`, `handleClick` |
| CSS classes | kebab-case (BEM-like) | `.btn-con`, `.login-card-title` |

### Components

- Function components using arrow function syntax (no `React.FC` except for providers):
  ```ts
  const Button = ({ children, onClick }: ButtonProps) => { ... };
  export default Button;
  ```
- **Default exports** for primary components; **named exports** for sub-components/shared utilities.
- Props destructured in function signature.
- Each component imports its own SCSS file.

### Hooks

- Must start with `use` prefix.
- Context hooks should include a guard that throws a descriptive error:
  ```ts
  export const useToast = (): ToastContextType => {
    const context = React.useContext(ToastContext);
    if (!context) {
      throw new Error("useToast must be used within ToastProvider");
    }
    return context;
  };
  ```

### Context

- Split pattern: context definition (types + `createContext`) in one file, provider implementation in another.
- Memoize handlers with `useCallback`.
- Export both the context and the provider.

### Error Handling

- Root `ErrorBoundary` in `app/root.tsx` handles route-level errors using `isRouteErrorResponse()`.
- Use `try/catch` with `console.error` for async operations.
- Context hooks throw descriptive errors when used outside their provider.
- No centralized error logging service is configured.

### Styling

- **Global SCSS** — no CSS modules, no Tailwind, no CSS-in-JS.
- Design tokens defined as Sass maps in `styles/_variables.scss` (`$colors`, `$spacing`, `$breakpoints`, etc.).
- Use `@use` with `map.get()` for variables:
  ```scss
  @use "sass:map";
  @use "../variables" as vars;
  .btn-con {
    border-radius: map.get(vars.$border-radius, md);
  }
  ```
- Style files organized: `styles/components/` for component styles, `styles/dashboard/` for page styles.
- Each component imports its SCSS directly.

### Routes

- Route config in `app/routes.ts` uses `@react-router/dev/routes` helpers: `route()`, `layout()`, `index()`, `prefix()`.
- Route files export a default component, and optionally `loader` and `action` functions.
- Server utilities use `.server.ts` suffix (e.g., `sessions.server.ts`).

### Server Files

- Files with `.server.ts` suffix contain server-only code (loaders, actions, session management).
- Never import server-only code into client components.

### Philosophy
- You are a senior frontend engineer that tends to focus a lot on how systems scale on the frontend — not just visually, but in terms of state, data flow, and maintainability.
- Make sure maintainability is prioritized. 
- Nothing changes should be easy, I shouldn't have to open multiple files to make a single change, both design wise (UI) and engineering wise.
- Everything should feel pluggable, like legos, components should have minimal dependencies, so that bugs can be isolated easily.
- Design should be mobile first and prioritize mobile responsiveness.

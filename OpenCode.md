# OpenCode - Transcripthor Development Guide

## Build/Test/Lint Commands
- `pnpm dev` - Start all services (web + backend)
- `pnpm dev:web` - Start web app only (port 3001)
- `pnpm dev:server` - Start backend/Convex only
- `pnpm build` - Build all packages
- `pnpm check` - Run Biome linter/formatter (auto-fix)
- `pnpm check-types` - TypeScript type checking

## Code Style Guidelines
- **Formatter**: Biome with double quotes, 2-space indentation
- **Imports**: Auto-organized by Biome, relative imports for local files
- **Components**: Default exports for React components, PascalCase naming
- **Types**: Use TypeScript interfaces/types, prefer `type` over `interface`
- **Styling**: Tailwind CSS with `cn()` utility for conditional classes
- **Error Handling**: Use ConvexError for backend, proper error boundaries
- **File Structure**: Components in `/components`, utilities in `/lib`
- **Backend**: Convex mutations/queries with proper validation using `v.*`
- **State**: TanStack Router for routing, React Hook Form + Zod for forms

## Tech Stack
- Frontend: React 19, TanStack Router, Tailwind CSS, Radix UI
- Backend: Convex, TypeScript
- Build: Turbo monorepo, Vite, pnpm workspaces
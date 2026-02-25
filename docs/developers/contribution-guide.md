# Contributing to Bventy

We are building a highly deliberate marketplace platform. Follow these guidelines to ensure consistency across our monorepo architecture.

## Local Setup

1. **Clone & Setup**:
   ```bash
   git clone https://github.com/bventy/web.git
   cd bventy-web
   npm install
   ```
2. **Environment Configuration**:
   - Create a `.env` file in the root directory.
   - Use the template from [environment.md](environment.md).
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   This will start all subdomains using Turborepo.

## UI & Design Standards

- **Packages**: All shared UI components must be added to `packages/ui`.
- **Atomic Design**: Build small, reusable primitives before assembling feature-specific layouts.
- **Radix UI**: Use Radix primitives for accessible interaction patterns.
- **Tailwind 4**: Follow thetypography-driven design language.

## Development Workflow

1. **Branching**: Use descriptive names (`feature/`, `fix/`).
2. **Commits**: Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`).
3. **Workspace Isolation**: When building for a specific app, ensure you are referencing shared logic via `@bventy/services` or `@bventy/ui`.

## Build Verification

Run the following commands before submitting a PR:
- `npm run lint`: Check for code quality issues.
- `npm run build`: Verify that all workspaces build correctly.

---
© 2026 Bventy.

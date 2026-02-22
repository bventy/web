# Contributing to Bventy Web

We are excited to build the future of event marketplaces together. Follow these guidelines to ensure a smooth contribution process.

## 🛠 Local Setup

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/bventy/web.git
   cd bventy-web
   ```
2. **Environment**:
   - Create `.env.local` using [ENVIRONMENT.md](ENVIRONMENT.md).
   - Point `NEXT_PUBLIC_API_URL` to your local Bventy API instance.
3. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

## 🎨 UI & Design Standards

### Components
- **Think Atomic**: Break down complex UI into small, reusable components in `src/components/ui`.
- **Composition over Inheritance**: Use React's composition patterns.
- **Radix UI**: Leverage Radix primitives for accessibility (Dialogs, Dropdowns, etc.).

### Styling
- Use **Tailwind CSS 4** for all styling.
- Avoid inline styles.
- Follow the established **Bventy Aesthetic**: Minimalist, clean, and typography-driven.

### Performance
- Use `Next.js` [Image component](https://nextjs.org/docs/app/building-your-application/optimizing/images) for all imagery.
- Keep client components at the leaves of the component tree where possible.

## 🚀 Development Workflow

1. **Branching**: Use a clear branch name: `feature/new-quote-modal` or `fix/auth-redirect`.
2. **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
3. **Draft PR**: Open a Draft PR early to get feedback on architecture.

## 🧪 Testing & Linting
- Run `npm run lint` before committing to ensure code quality.
- Verify your changes on mobile, tablet, and desktop views.

---
Thank you for helping us make Bventy better!

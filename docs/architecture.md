# Architecture

Bventy Web is built for responsiveness and clarity. We use modern React patterns to manage a complex dual-sided marketplace interface without sacrificing performance.

## Design Philosophy
- Typography First: We rely on the Geist font family and high-contrast layouts to communicate value without decorative clutter.
- Interaction Gating: Complex flows (like quote requests) are broken into logical steps to prevent user fatigue.
- Accessibility: All core components use standard semantic HTML or Radix UI primitives to ensure the platform is usable by everyone.

## Core Components

### App Router Structure
The application uses the Next.js App Router for optimized server-client transitions.
- /app: Unified routing and layout management.
- /components/ui: Atomic design elements like buttons, inputs, and modals.
- /components/auth: Secure onboarding and login interfaces.
- /components/vendor: Specialized dashboard components for service providers.

### State and Data Flow
- AuthContext: Manages the global user session and role-based access.
- Service Layer: An abstraction layer (using Axios) that handles all backend communication. This keeps components clean of API-specific logic.
- Type Safety: TypeScript is used throughout the codebase to ensure data consistency across the marketplace lifecycle.

### Media Handling
- FileUpload: A unified component handling both image and PDF uploads.
- Client-Side Compression: Images are compressed in the browser to reduce upload times and R2 storage costs.
- PDF Icons: Custom rendering for document previews to maintain a consistent visual style.

## Performance
We leverage Next.js SSR and ISR where appropriate to ensure vendor profiles and search pages load instantly. Static assets are optimized via the built-in Next/Image component and Tailwind's performant CSS generation.

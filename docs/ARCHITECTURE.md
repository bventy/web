# Frontend Architecture

Bventy Web is built on Next.js 15, optimized for the App Router and high-performance React patterns.

## 🏗 Layered Structure

### 1. **Pages & Routing (`src/app`)**
Uses Next.js App Router.
- **Root Layout**: Manages global providers (Auth, Themes, PostHog, Umami).
- **Domain Groups**: Logically grouped pages for Organizers, Vendors, and Admins.
- **Dynamic Routes**: Slug-based routing for vendor profiles (`/vendors/[slug]`).

### 2. **Component Architecture (`src/components`)**
- **UI Base (`src/components/ui`)**: Foundation components (Buttons, Inputs, Dialogs) built on Radix UI primitives.
- **Domain Components**: Logic-heavy components specific to features like `QuoteRequestModal` or `GalleryUpload`.
- **Layouts**: Consistent Navbar and Footer structures.

### 3. **Service Layer (`src/services`)**
The frontend communicates with the backend exclusively through the service layer.
- **Axios Instance**: Configured with interceptors for automatic JWT attachment.
- **Service Objects**: Clean, promise-based wrappers for API endpoints (e.g., `quoteService`, `vendorService`).
- **Type Safety**: All services are typed with TypeScript interfaces defined in `src/types`.

### 4. **State Management (`src/context`)**
- **AuthContext**: Unified state for user identity, roles, and session persistence. It handles login/signup flows and provides easy access to the current user object globally.

## 🎨 Styling & Design
- **Tailwind CSS 4**: We leverage the utility-first philosophy but maintain a strict design system via a centralized configuration.
- **Typography-First**: The design relies on the `Geist` font family, emphasizing hierarchy and readability.
- **Glassmorphism**: Subtle use of backdrop blurs and translucent layers in headers and modular cards.

## 📈 Analytics & Tracking
- **PostHog**: Handles event tracking, session recording, and feature flagging.
- **Umami**: Lightweight, privacy-focused alternative for general traffic metrics.
- **TrackService**: A frontend abstraction that maps user actions (clicks, views) to backend tracking events.

## 🛡 Security
- **JWT Protection**: Tokens are stored securely and managed by the Auth context.
- **Route Guards**: Dashboard and admin routes are protected at the layout level, redirecting unauthenticated users or those with insufficient roles.

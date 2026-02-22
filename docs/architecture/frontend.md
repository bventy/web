# Frontend Architecture

Bventy's frontend is built with Next.js 15 and React 19, leveraging the latest features for performance and developer experience.

## Core Technologies

- **Next.js 15**: Utilizing the App Router and Server Actions for efficient data management.
- **Tailwind CSS 4**: A utility-first styling framework used to implement our calm, minimal design system.
- **Radix UI**: Accessible UI primitives that form the basis for our custom components.
- **TypeScript**: Ensuring end-to-end type safety for all marketplace interactions.

## Application Structure

- `src/app`: Page layouts and routing.
- `src/components`: UI components, organized by feature (admin, auth, vendors, organizers).
- `src/services`: Integration logic for interacting with the backend API.
- `src/hooks`: Custom React hooks for shared state and interaction patterns.

## State Management

We prefer local component state and URL-driven state (via `next/navigation`) to keep the application predictable and easy to debug. Global state is minimized and used primarily for session management.

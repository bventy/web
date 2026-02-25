# Backend Integration

Bventy's frontend applications interact with the backend API via a shared service layer defined in `@bventy/services`.

## Authentication & Session Management

Authentication is managed centrally via the `auth.bventy.in` subdomain.

- **Cookie-Based Sessions**: The backend sets an `HttpOnly`, `SameSite=None`, `Secure` cookie on the parent domain `.bventy.in`.
- **Global Hydration**: The `AuthContext` in `@bventy/services` automatically attempts to hydrate the user session from these cookies on initial mount within any subdomain.
- **Cross-Subdomain Sync**: To mitigate third-party cookie restrictions, the frontend implements a URL-based token synchronization when transitioning between subdomains (e.g., from `auth` to `app`).

## Service Layer Pattern

Applications do not call the API directly. Instead, they consume typed domain services from `@bventy/services`.

- **api Instance**: A centralized Axios instance with interceptors for attaching the `Authorization` header and handling standardized error responses.
- **Domain Services**:
    - `userService`: Manages identity and profile metadata.
    - `eventService`: Handles event lifecycles and shortlisting.
    - `quoteService`: Manages the marketplace negotiation loop.
    - `groupService`: logic for community and agency management.

## Technical Requirements

- **API URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable.
- **CORS**: The backend specifically allows `Origin` requests from all `*.bventy.in` subdomains with `Credentials` enabled.

---
© 2026 Bventy.

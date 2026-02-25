# Environment Variables Guide

Bventy uses a centralized configuration for its cross-subdomain monorepo architecture. Locally, create a `.env` file in the root directory.

## Core Variable Set

### API Configuration
- **`NEXT_PUBLIC_API_URL`**: Target URL for the Bventy backend API.

### Cookie Management
- **`NEXT_PUBLIC_COOKIE_DOMAIN`**: Set to `.bventy.in` for cross-subdomain session persistence.

### Subdomain Routing
- **`NEXT_PUBLIC_WWW_URL`**: Base URL for marketing and discovery.
- **`NEXT_PUBLIC_AUTH_URL`**: Centralized authentication entry point.
- **`NEXT_PUBLIC_APP_URL`**: Organizer workspace hub.
- **`NEXT_PUBLIC_VENDOR_URL`**: Vendor management portal.
- **`NEXT_PUBLIC_ADMIN_URL`**: Restricted platform administration.

### Observability
- **`NEXT_PUBLIC_POSTHOG_KEY`**: Client-side event tracking key.
- **`NEXT_PUBLIC_UMAMI_WEBSITE_ID`**: Privacy-focused traffic analytics ID.

## Security Practices

1. **Public Exposure**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the client. Never include private keys or database credentials in these.
2. **Monorepo Propagation**: Turborepo automatically provides these variables to each app workspace during the build process.
3. **Local Safety**: Ensure `.env` is ignored by version control.

---
© 2026 Bventy.

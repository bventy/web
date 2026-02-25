# Client-Side Data Model

Bventy maintains a centralized data model within the `@bventy/services` package, ensuring consistent type-safety across all subdomain applications.

## Core Domain Models

### User & Session
- **UserProfile**: Central identity model containing roles (`user`, `vendor`, `admin`), profile metadata, and permission sets.
- **Session**: Hybrid state combining JWT data with real-time hydration status.

### Marketplace Lifecycle
- **Quote**: The core transactional model tracking currency, status (`pending`, `responded`, `accepted`), and time-based expiry.
- **Event**: The organizational context detailing requirements, budget ranges, and ownership (Individual or Group).
- **VendorProfile**: Comprehensive data structure for service providers, including service categories and media references.

## Data Governance Patterns

- **Type-Safe Boundaries**: All API interactions are strictly typed using shared interfaces to prevent runtime inconsistencies after monorepo deployments.
- **Service-Level Transformation**: The `@bventy/services` layer handles raw API response sanitization and normalization before data reaches the application UI components.
- **Predictable Immutability**: We prioritize immutable data patterns within our React state management to simplify debugging and improve rendering performance.

---
© 2026 Bventy.

# Client-Side Data Handling

The Bventy frontend is designed to handle user data with care, ensuring that sensitive information is only processed when necessary.

## Data Life Cycle

### Session Management
User authentication is managed via secure, stateless JWT tokens. These tokens are stored securely and used exclusively for authorizing requests to the backend API.

### Local Caching
To ensure a performant experience, we cache discovery data (like vendor profile lists). This data is localized to the user's current session and is not used for cross-session profiling.

### Sanitization and Safety
All user-provided content is sanitized before it is rendered to the screen. This protects against cross-site scripting (XSS) and ensures that the platform remains safe for everyone.

## Data Revocation

The frontend respects the backend's access revocation rules. When a quote's visibility period expires, the frontend removes the sensitive contact data from the view and transition to a historical record state.

## Tracking Opt-Out
Our analytics solutions are chosen for their privacy-first approach. We respect the "Do Not Track" (DNT) browser settings and minimize the collection of diagnostic metadata.

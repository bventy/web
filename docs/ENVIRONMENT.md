# Environment Variables Guide

Bventy Web uses environment variables for build-time and runtime configuration. Locally, create a `.env.local` file in the root directory.

## 🔑 Required Variables

### API Connection
- **`NEXT_PUBLIC_API_URL`**: The base URL of the Bventy Go backend.
  - *Example*: `http://localhost:8082` (Local)
  - *Example*: `https://api.bventy.in` (Production)

### Analytics & Tracking
- **`NEXT_PUBLIC_POSTHOG_KEY`**: Your PostHog project API key.
- **`NEXT_PUBLIC_POSTHOG_HOST`**: PostHog host URL (usually `https://us.i.posthog.com`).
- **`NEXT_PUBLIC_UMAMI_WEBSITE_ID`**: The unique ID for your Umami analytics project.

## 🛡 Security Rules
1. **Public vs. Server**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put sensitive secrets (DB passwords, API secrets) in these.
2. **Local Development**: Ensure `.env.local` is never committed to version control.
3. **Vercel/Deployment**: Configure these variables in your deployment platform's dashboard for staging and production environments.

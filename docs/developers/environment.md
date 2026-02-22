# Environment Reference

The following variables are required to run the Bventy frontend. For local development, use a `.env.local` file.

## API Connection

- `NEXT_PUBLIC_API_URL`: The full URL of your running backend API (e.g., `http://localhost:8080`).

## Discovery and Auth

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: (Optional) If using Cloudinary for additional media handling.
- `NEXT_PUBLIC_APP_URL`: The base URL of the frontend application.

## Analytics

- `NEXT_PUBLIC_POSTHOG_KEY`: The API key for your PostHog project.
- `NEXT_PUBLIC_POSTHOG_HOST`: Your PostHog instance host.
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: Your Umami website ID.
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL`: The URL to your hosted Umami script.

## Rules

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Ensure that no sensitive secrets (like API private keys) use this prefix.

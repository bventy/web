# Tracking and Analytics

Our frontend analytics are designed to be helpful for platform improvements while strictly respecting user privacy.

## Tracking Principles

- **Anonymous by Default**: We do not track personal identifiers unless specifically necessary for platform operations.
- **Action-Oriented**: We track discrete marketplace actions (e.g., "quote_submitted") rather than passive browsing behavior.
- **No Third-Party Cookies**: We prioritize privacy-respecting analytics solutions like PostHog and Umami, configured to avoid invasive cross-site tracking.

## Analytics Implementation

Tracking is centralized in a React Provider pattern, ensuring that events are captured consistently across the application without polluting the UI logic.

## Administrative Metrics

The frontend provides a dedicated admin dashboard that visualizes system performance, marketplace growth, and vendor activity, providing transparency into the platform's health.

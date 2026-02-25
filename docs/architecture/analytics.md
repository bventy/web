# Tracking & Analytics

Bventy implements a privacy-first observability layer designed to monitor platform health and marketplace efficiency without compromising user anonymity.

## Core Principles

- **Anonymous by Default**: We strictly avoid tracking personally identifiable information (PII) unless required for operational integrity.
- **Cross-Subdomain Continuity**: Tracking IDs are synchronized across all subdomains (`auth.bventy.in`, `app.bventy.in`, etc.) using parent-domain cookies to maintain accurate session attribution.
- **Action-Oriented Metrics**: We prioritize discrete marketplace events (e.g., `quote_submitted`, `vendor_verified`) over passive browsing behavior.

## Implementation Stack

- **PostHog**: Used for advanced event attribution and user journey mapping. Initialized via a centralized React Provider in `@bventy/services`.
- **Umami**: Lightweight, privacy-focused analytics for aggregate traffic monitoring and performance metrics.
- **Service Layer Integration**: Event tracking is triggered from the domain services in `@bventy/services`, ensuring consistency across different subdomain applications.

## Administrative Visibility

Platform health and marketplace metrics are visualized on the restricted Admin Dashboard.

- **Overview**: Real-time platform activity and system health status.
- **Growth**: Tracking user and vendor onboarding trends.
- **Marketplace**: Monitoring the efficiency of the quote request and fulfillment loop.

---
© 2026 Bventy.

# bventy-web

## Philosophy

Bventy Web is the presentation layer of a marketplace designed for high-quality, intentional interaction. We reject the pattern of cluttered, high-pressure UIs in favor of a clean, typography-driven experience that respects the user's focus.

Our design focuses on:
- Clarity of intent: Every screen is designed to facilitate a specific step in the marketplace lifecycle.
- Minimalist aesthetic: Removing distractions to let service offerings and event requirements stand out.
- Responsive utility: A seamless experience whether building an event on a desktop or managing quotes on a mobile device.
- Transparent flow: Users always know exactly where they are in the process of discovery, negotiation, or fulfillment.

## Architecture Overview

The frontend is a modern Next.js 15 application using the App Router. It is designed for speed, modularity, and maintainability.

- Frontend: Next.js 15 with React 19.
- Styling: Tailwind CSS 4 for lean, performant design.
- Components: Radix UI primitives for accessible, robust interaction.
- State: React Context for unified authentication and session management.
- API: Custom service layer using Axios with built-in security interceptors.

## Marketplace Lifecycle

The frontend supports the core Bventy workflow:

1. Discovery: Search and browse verified vendors through a calm, high-contrast interface.
2. Request Quote: A mandatory-message request flow that ensures vendors have the context they need.
3. Vendor Responds: A dedicated dashboard for vendors to provide pricing and rate cards (PDF/Image).
4. Organizer Accepts: A simple approval flow for organizers once terms are agreed upon.
5. Contact Unlock: Secure revealing of contact details after mutual acceptance.
6. Expiry + Archive: Automated cleanup of old requests to maintain dashboard focus.

## Privacy & Data

We prioritize transparency in how user data is handled in the browser.
- No hidden tracking: Operational metrics are gathered to ensure system stability.
- Client-side Security: User contact data is only fetched from the API when the quote state permits it.
- Minimalism: We avoid invasive session recording or third-party behavioral analytics.

## License Explanation

This project is licensed under the Apache License 2.0 with the Commons Clause restriction.

The source code is open for modification and private use. However, the Commons Clause prohibits selling the software or providing it as a commercial service (SaaS) without written permission. This allows the project to grow while protecting its long-term independence.

## Contributing

We welcome improvements that help make Bventy more useful and stable.
- Design: We value contributions that maintain our minimalist, human-first aesthetic.
- Functionality: PRs for performance tuning and bug fixes are encouraged.
- Roadmap: Our development goals are openly documented in the repository.

## Roadmap

Planned improvements for the frontend experience. No timelines are promised.

- Refined quote management UI
- Vendor review and rating interfaces
- Performance scoring visualizations
- Payment and escrow integration (future)
- Financial dashboard for vendors (future)

---
© 2026 Bventy.

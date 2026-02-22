# Data Model

The frontend uses TypeScript interfaces to ensure that data coming from the Bventy API is handled reliably and predictably.

## Core Interfaces

### User
- `id`: Unique identifier.
- `email`: User's electronic mail.
- `role`: Permission level (admin, super_admin, user, vendor).
- `vendor_profile`: Optional object containing vendor-specific details.

### Quote
- `id`: Unique identifier for the request.
- `status`: One of (pending, responded, revision_requested, accepted, rejected).
- `quoted_price`: Numeric value of the current offer.
- `organizer_message`: Original request detail.
- `vendor_message`: Most recent response from the vendor.
- `attachment_url`: Link to the rate card or proposal document.

### Vendor
- `id`: Unique identifier.
- `name`: Display name of the service provider.
- `slug`: URL-friendly identifier for the public profile.
- `category`: Service niche (Photography, Catering, etc.).
- `gallery`: Array of R2 image URLs for the profile.

## Client-Side Processing
We perform minimal data transformation on the client to keep the application fast.
- Date Formatting: Timestamps are converted to human-readable locale formats for display.
- Currency: Prices are formatted according to project-wide locale standards.
- Status Mapping: Backend status strings are mapped to color-coded badges for visual clarity.

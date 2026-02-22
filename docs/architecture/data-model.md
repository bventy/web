# Client-Side Data Model

The frontend uses TypeScript interfaces to mirror the backend's data structures, ensuring consistency across the network boundary.

## Core Interfaces

### User
Represents the authenticated user, including their role (Organizer, Vendor, Admin) and basic profile metadata.

### Quote
Tracks the state of a marketplace interaction. Includes pricing, status, and the participating parties.

### VendorProfile
Contains the data required to render a vendor's public presence, including their description, services, and media gallery.

### Event
The context for a quote request, detailing the organizer's requirements for a specific engagement.

## Data Processing

- **Validation**: We use client-side validation for all forms to provide immediate feedback before data is sent to the backend.
- **Sanitization**: All user-provided content is sanitized before rendering to protect against cross-site scripting (XSS).
- **Transformation**: The service layer handles any necessary data transformation between the API response format and the component requirements.

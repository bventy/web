# Marketplace Lifecycle

Bventy Web is designed to guide users through the specific stages of a service agreement. By enforcing these transitions on the frontend, we prevent communication breakdown and ensure data quality.

## Quote Flow Experience

### 1. Requesting
When an organizer requests a quote:
- The interface enforces a mandatory message field.
- The budget is set via specific ranges or exact amounts to manage vendor expectations.
- The organizer selects a specific event to link the quote to.

### 2. Monitoring
Dashboard views for both parties show the current status of every request:
- **Pending**: Waiting for vendor response.
- **Responded**: Pricing provided, waiting for organizer decision.
- **Revision Requested**: Organizer has asked for changes.
- **Accepted / Rejected**: Terminal states of a request.

### 3. Negotiating
If an organizer is not satisfied, they can trigger a **Revision Request**. This opens a text field for specific feedback, which the vendor see immediately on their dashboard to refine their offer.

### 4. Fulfillment
Once a quote is **Accepted**, the UI updates to reveal previously hidden contact details. This transition marks the end of the on-platform negotiation and allows for off-platform fulfillment.

## User Interface States
- Empty States: We provide clear guidance when no quotes or events are present.
- Success Indicators: Feedback is provided for every successful transition (Acceptance, Response, Revision).
- Gated Buttons: Actions are disabled until all required validation criteria (like message content) are met.

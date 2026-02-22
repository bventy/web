# Quote Lifecycle State Diagram

The frontend UI responds dynamically to the lifecycle of a quote, ensuring users are always guided toward the appropriate action.

```mermaid
stateDiagram-v2
    [*] --> Pending: Request Submitted
    Pending --> Responded: Proposal Received
    Responded --> RevisionRequested: Feedback Provided
    RevisionRequested --> Responded: Proposal Updated
    Responded --> Accepted: Quote Approved
    Accepted --> Completed: Engagement Finalized
    Accepted --> Expired: Access Window Closed
    Pending --> Cancelled: Request Terminated
    Responded --> Cancelled: Request Terminated
    Completed --> [*]
    Cancelled --> [*]
    Expired --> [*]
```

## UI Responses by State

- **Pending**: Displaying "Awaiting Vendor Response". Organizers can cancel or edit the heartbeat of the request.
- **Responded**: Highlighting the pricing and vision. Activating the "Accept" and "Request Revision" actions.
- **Accepted**: Revealing "Contact Information". Transitioning the workflow to out-of-platform fulfillment.
- **Expired/Cancelled**: Rendering the quote in a "read-only" history view with clear status indicators.

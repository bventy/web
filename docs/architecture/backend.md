# Backend Integration

The frontend treats the backend as a black box accessible through a structured REST API.

## API Communication

We use Axios to handle HTTP requests. All communication is authenticated via a JWT stored securely in the client's session.

## Domain Services

The frontend organizes its integration around domain services:
- `authService`: Handles signup, login, and session persistence.
- `vendorService`: Manages vendor profiles and discovery.
- `quoteService`: Tracks the lifecycle of quote requests and responses.

## Error Handling

The integration layer is responsible for translating backend error codes into meaningful, calm feedback for the user. We avoid technical jargon in error messages, prioritizing human clarity.

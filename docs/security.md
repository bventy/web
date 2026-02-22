# Security

Bventy Web handles sensitive marketplace data. We implement multiple layers of security on the frontend to protect user privacy and project integrity.

## Authentication and Sessions
- Secure Identity: We use JWTs for stateless authentication. Tokens are stored securely and never exposed in cleartext within log files.
- Context Cleanup: Upon logout, all session state and cached user data are immediately purged from the React Context and local storage.

## Data Gating and Privacy
- Intentional Visibility: Contact information is strictly hidden at the UI level until the backend validates that a quote has reached the "Accepted" state.
- Operational Tracking: We only track metrics that help us understand platform stability and marketplace health. We do not use third-party scripts that track user behavior across other websites.

## Media Integrity
- File Sanitization: Images are processed through a client-side compression layer that strips metadata before the binary is sent to Cloudflare R2.
- Size Limits: We enforce a 5MB upload limit directly in the browser to prevent system abuse and ensure a fast experience for all users.
- Type Whitelisting: Only specific file types (PDF, JPG, PNG) are accepted by the upload components.

## Environment Gating
- Prefix Safety: Only environment variables prefixed with `NEXT_PUBLIC_` are reachable by the browser. This prevents sensitive backend keys from being leaked into the frontend bundle.
- Build-Time Validation: Critical configuration is validated during the build phase to prevent deploying a broken or insecure application state.

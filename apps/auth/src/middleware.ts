import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // If this is an API request being proxied, we might need to fix cookies
    if (request.nextUrl.pathname.startsWith('/api')) {
        // Note: Middleware can modify outgoing response headers.
        // However, for rewritten requests, the Set-Cookie comes from the destination.
        // Next.js propagates these. We can intercept and modify them.

        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            // Magic: Replace .bventy.in with .lvh.me in the cookie domain
            const newSetCookie = setCookie.replace(/domain=\.bventy\.in/gi, 'domain=.lvh.me');
            response.headers.set('set-cookie', newSetCookie);
        }
    }

    return response;
}

export const config = {
    matcher: '/api/:path*',
};

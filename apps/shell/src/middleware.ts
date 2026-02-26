import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const host = request.headers.get('host') || '';

    // 1. Determine which app to serve based on subdomain
    let appPath = '/www';
    if (host.startsWith('auth.')) {
        appPath = '/auth';
    } else if (host.startsWith('app.')) {
        appPath = '/app';
    } else if (host.startsWith('vendor.')) {
        appPath = '/vendor';
    } else if (host.startsWith('admin.')) {
        appPath = '/admin';
    }

    // 2. Rewrite internal path
    url.pathname = `${appPath}${url.pathname}`;
    const response = NextResponse.rewrite(url);

    // 3. Fix Cookie Domain for local development
    // (We intercept the response to rewrite Set-Cookie headers from the backend)
    // Note: Since this is a rewrite, headers might be tricky to catch here.
    // We'll also rely on the individual app configs if needed, but the Shell is the primary gateway.

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (internal rewrites handled by next.config.api)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

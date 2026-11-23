import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './lib/auth-cookies';

/**
 * Middleware protecting routes and preventing unauthenticated access.
 * Checks for presence of access_token or refresh_token httpOnly cookies.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicPage = isAuthPage || pathname.startsWith('/status');

  // If user is authenticated and navigating to login/register, redirect to dashboard /
  if (isAuthenticated && isAuthPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // If user is unauthenticated and attempting to visit a protected route, redirect to /login
  if (!isAuthenticated && !isPublicPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API route handlers manage their own auth response)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

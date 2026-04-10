import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

/**
 * Standard Next.js 16 Proxy (formerly Middleware)
 * Handles internationalization and admin route bypassing.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Bypass all internationalization for admin boundary
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // 2. Use next-intl middleware for all other public routes
  return intlMiddleware(req);
}

export const config = {
  // Enhanced matcher to avoid proxy interference on static assets and admin
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};

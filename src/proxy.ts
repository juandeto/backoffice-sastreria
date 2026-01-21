// Proxy disabled.
// Rename this file to `proxy.ts` to enable it.
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/updateSession';
import allowedOrigins from '@/lib/constants/origins';

const protectedRoutes = '/dashboard';

/**
 * Runs before requests complete.
 * Use for rewrites, redirects, or header changes.
 * Refer to Next.js Proxy docs for more examples.
 */
export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = request.nextUrl.pathname.startsWith(protectedRoutes);
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const hasSession = request.cookies.get('session');

  console.log('request.nextUrl.pathname: ', request.nextUrl.pathname);

  // No aplicar protección de rutas a las rutas de API (tRPC maneja su propia autenticación)
  if (!isApiRoute && ((!user && isProtectedRoute) || (!hasSession && isProtectedRoute))) {
    return NextResponse.redirect(new URL('/auth/v1/login', request.url));
  }

  // const nonce = generateNonce();

  // CORS para rutas /api
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigin = origin && allowedOrigins.includes(origin) 
      ? origin 
      : allowedOrigins[0] || '*';

    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Manejar preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  return response;
}

/**
 * Matcher runs for all routes.
 * To skip assets or APIs, use a negative matcher from docs.
 */
export const config = {
  matcher: '/:path*',
};

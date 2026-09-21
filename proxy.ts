import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi semua rute /admin kecuali halaman login (/admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;

    // Verifikasi HMAC signature dan masa berlaku token
    const session = verifyAdminSessionToken(sessionCookie);

    // Jika cookie tidak ada, tidak valid, atau telah kadaluarsa
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);

      // Bersihkan cookie palsu / kadaluarsa dari browser
      if (sessionCookie) {
        response.cookies.delete(COOKIE_NAME);
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

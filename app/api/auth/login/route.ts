import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  createAdminSessionToken,
  COOKIE_NAME,
  isValidOrigin,
  timingSafeCompare,
} from '@/lib/auth/session';

// In-memory rate limiter untuk proteksi brute force
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown-ip';
}

export async function POST(request: Request) {
  // 0. Validasi Origin untuk mencegah Cross-Site Request Forgery (CSRF)
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Invalid request origin.' },
      { status: 403 }
    );
  }

  const ip = getClientIp(request);
  const now = Date.now();

  // 1. Cek status lockout rate limit
  const rateLimit = failedAttempts.get(ip);
  if (rateLimit && rateLimit.lockedUntil > now) {
    const remainingSec = Math.ceil((rateLimit.lockedUntil - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: `Terlalu banyak percobaan gagal. Silakan tunggu ${remainingSec} detik lagi.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email = (body?.email || '').trim().toLowerCase();
    const password = (body?.password || '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    let isValid = false;

    // 2. Verifikasi 1: Coba Supabase Auth jika terkonfigurasi
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.session) {
          isValid = true;
        }
      } catch (sbErr) {
        console.warn('Supabase auth error, checking server env:', sbErr);
      }
    }

    // 3. Verifikasi 2: Cek kredensial server di .env.local dengan constant-time comparison
    const expectedEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!isValid) {
      if (!expectedEmail || !expectedPassword) {
        console.error(
          'CRITICAL: ADMIN_EMAIL atau ADMIN_PASSWORD belum dikonfigurasi di environment server.'
        );
        return NextResponse.json(
          {
            success: false,
            error:
              'Konfigurasi autentikasi server belum lengkap. Harap konfigurasi ADMIN_EMAIL dan ADMIN_PASSWORD.',
          },
          { status: 500 }
        );
      }

      // Gunakan timingSafeCompare pada kedua parameter untuk mencegah timing side-channels
      if (
        timingSafeCompare(email, expectedEmail) &&
        timingSafeCompare(password, expectedPassword)
      ) {
        isValid = true;
      }
    }

    // 4. Jika kredensial salah -> Catat kegagalan & rate limit
    if (!isValid) {
      const current = failedAttempts.get(ip) || { count: 0, lockedUntil: 0 };
      const newCount = current.count + 1;
      let lockedUntil = 0;

      if (newCount >= 5) {
        lockedUntil = now + 5 * 60 * 1000; // Kunci 5 menit jika 5x berturut-turut salah
      }

      failedAttempts.set(ip, { count: newCount, lockedUntil });

      return NextResponse.json(
        {
          success: false,
          error:
            newCount >= 5
              ? 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 5 menit demi keamanan.'
              : 'Email atau password admin salah. Silakan periksa kembali.',
        },
        { status: 401 }
      );
    }

    // 5. Berhasil -> Reset counter kegagalan
    failedAttempts.delete(ip);

    // 6. Buat Signed HMAC Session Token
    const sessionToken = createAdminSessionToken(email);

    // 7. Simpan di HTTP-Only Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return NextResponse.json({
      success: true,
      message: 'Login admin berhasil.',
      user: { email, role: 'admin' },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat verifikasi.' },
      { status: 500 }
    );
  }
}

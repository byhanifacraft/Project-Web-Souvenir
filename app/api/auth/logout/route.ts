import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, isValidOrigin } from '@/lib/auth/session';

export async function POST(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Invalid request origin.' },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}

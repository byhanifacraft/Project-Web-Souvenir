import crypto from 'crypto';

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('CRITICAL: ADMIN_SESSION_SECRET belum dikonfigurasi di environment server.');
  }
  return secret;
}

const COOKIE_NAME = 'admin_session';

export interface SessionPayload {
  email: string;
  role: 'admin';
  exp: number; // Unix timestamp
}

export function createAdminSessionToken(email: string): string {
  const secret = getSessionSecret();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    role: 'admin',
    exp,
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(dataStr).digest('base64url');

  return `${dataStr}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  try {
    const secret = getSessionSecret();
    const [dataStr, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', secret).update(dataStr).digest('base64url');

    // Gunakan timingSafeEqual untuk mencegah timing attack
    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSig);
    if (
      sigBuffer.length !== expectedSigBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
    ) {
      return null; // Signature tidak cocok / tampered
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(dataStr, 'base64url').toString('utf-8'));

    if (Date.now() > payload.exp) {
      return null; // Sesi kadaluarsa
    }

    return payload;
  } catch (err) {
    console.error('Session token verification failed:', err);
    return null;
  }
}

/**
 * Memvalidasi origin header terhadap host untuk mencegah Cross-Site Request Forgery (CSRF)
 */
export function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true; // request non-browser / direct server
  try {
    const originHost = new URL(origin).host;
    return originHost.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison menggunakan SHA-256 hash untuk mencegah timing attack
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const hashA = crypto.createHash('sha256').update(a).digest();
    const hashB = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };

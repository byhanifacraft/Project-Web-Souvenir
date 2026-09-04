import crypto from 'crypto';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'craftbyhanifa-default-secret-salt-2026';
const COOKIE_NAME = 'admin_session';

export interface SessionPayload {
  email: string;
  role: 'admin';
  exp: number; // Unix timestamp
}

export function createAdminSessionToken(email: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 hari
  const payload: SessionPayload = {
    email: email.toLowerCase().trim(),
    role: 'admin',
    exp,
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(dataStr).digest('base64url');

  return `${dataStr}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [dataStr, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET).update(dataStr).digest('base64url');

  if (signature !== expectedSig) {
    return null; // Signature tidak cocok / tampered
  }

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(dataStr, 'base64url').toString('utf-8'));

    if (Date.now() > payload.exp) {
      return null; // Sesi kadaluarsa
    }

    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

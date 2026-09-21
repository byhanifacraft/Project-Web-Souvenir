import { describe, it, expect, beforeEach } from 'vitest';
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
  timingSafeCompare,
  isValidOrigin,
} from '../lib/auth/session';

describe('Security & Authentication Helpers', () => {
  const TEST_SECRET = 'test-super-secret-key-32-chars-long-at-least!';

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = TEST_SECRET;
  });

  describe('Admin Session Token (HMAC-SHA256)', () => {
    it('creates and verifies a valid admin session token', () => {
      const email = 'admin@craftbyhanifa.com';
      const token = createAdminSessionToken(email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.includes('.')).toBe(true);

      const payload = verifyAdminSessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.email).toBe(email);
      expect(payload?.role).toBe('admin');
      expect(payload?.exp).toBeGreaterThan(Date.now());
    });

    it('rejects tampered session token payload', () => {
      const token = createAdminSessionToken('admin@craftbyhanifa.com');
      const [, sig] = token.split('.');

      // Tamper base64 data to change email
      const tamperedPayload = {
        email: 'attacker@malicious.com',
        role: 'admin',
        exp: Date.now() + 10000,
      };
      const tamperedDataStr = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');
      const tamperedToken = `${tamperedDataStr}.${sig}`;

      const verified = verifyAdminSessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('rejects tampered session token signature', () => {
      const token = createAdminSessionToken('admin@craftbyhanifa.com');
      const [dataStr] = token.split('.');
      const fakeSig = 'invalidsignaturecharacters1234567890abcdef';
      const tamperedToken = `${dataStr}.${fakeSig}`;

      const verified = verifyAdminSessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('returns null for null, undefined, or empty token', () => {
      expect(verifyAdminSessionToken(null)).toBeNull();
      expect(verifyAdminSessionToken(undefined)).toBeNull();
      expect(verifyAdminSessionToken('')).toBeNull();
      expect(verifyAdminSessionToken('not-a-token')).toBeNull();
    });
  });

  describe('timingSafeCompare', () => {
    it('returns true for identical strings', () => {
      expect(timingSafeCompare('SecretPassword123!', 'SecretPassword123!')).toBe(true);
      expect(timingSafeCompare('', '')).toBe(true);
    });

    it('returns false for different strings', () => {
      expect(timingSafeCompare('SecretPassword123!', 'WrongPassword123!')).toBe(false);
      expect(timingSafeCompare('short', 'longer-string')).toBe(false);
    });
  });

  describe('isValidOrigin', () => {
    it('returns true when origin and host match', () => {
      const req = new Request('http://localhost:3000/api/store', {
        headers: {
          origin: 'http://localhost:3000',
          host: 'localhost:3000',
        },
      });
      expect(isValidOrigin(req)).toBe(true);
    });

    it('returns false for cross-origin requests', () => {
      const req = new Request('http://localhost:3000/api/store', {
        headers: {
          origin: 'https://evil-attacker.com',
          host: 'localhost:3000',
        },
      });
      expect(isValidOrigin(req)).toBe(false);
    });

    it('returns true when origin or host header is absent (direct server-side / curl)', () => {
      const req = new Request('http://localhost:3000/api/store');
      expect(isValidOrigin(req)).toBe(true);
    });
  });
});

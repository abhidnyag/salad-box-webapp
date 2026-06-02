import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';

/**
 * Authentication primitives — built entirely on Node's standard `crypto`
 * module so there are no native dependencies to compile on Windows.
 *
 *  - Passwords are *encoded* with scrypt + a per-user random salt and stored
 *    as `salt:hash`. They are never reversible; login *decodes* by re-deriving
 *    the hash from the supplied password and comparing in constant time.
 *  - Sessions use a compact signed token (JWT-like): a base64url JSON payload
 *    plus an HMAC-SHA256 signature. `signToken` encodes, `verifyToken` decodes
 *    and validates the signature + expiry.
 */

// ─────────────────────────── Password hashing ───────────────────────────

const SCRYPT_KEYLEN = 64;
const SALT_BYTES = 16;

/** Encode a plaintext password into a `salt:hash` string for storage. */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
  return `${salt}:${derived}`;
}

/** Verify a plaintext password against a stored `salt:hash` value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;

  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  const keyBuffer = Buffer.from(key, 'hex');
  // Length check guards timingSafeEqual, which throws on length mismatch.
  if (keyBuffer.length !== derived.length) return false;
  return timingSafeEqual(keyBuffer, derived);
}

// ─────────────────────────── Session tokens ─────────────────────────────

const SECRET = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface TokenPayload {
  userId: number;
  email: string;
  exp: number; // epoch ms
}

function sign(encodedPayload: string): string {
  return createHmac('sha256', SECRET).update(encodedPayload).digest('base64url');
}

/** Encode + sign a session token for a user. */
export function signToken(payload: { userId: number; email: string }): string {
  const body: TokenPayload = { ...payload, exp: Date.now() + TOKEN_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

/** Decode + validate a session token. Returns the payload or null if invalid/expired. */
export function verifyToken(token: string): TokenPayload | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expBuffer.length || !timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as TokenPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { query, queryOne } from './db';

const BCRYPT_ROUNDS = 12;
const SESSION_DAYS = 30;

export async function hashPassword(pw: string): Promise<string> {
  return hash(pw, BCRYPT_ROUNDS);
}

export async function verifyPassword(pw: string, hashStr: string): Promise<boolean> {
  return compare(pw, hashStr);
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function sessionExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + SESSION_DAYS);
  return d;
}

type UserRow = { id: string; email: string; name: string; created_at: string };
type SessionRow = { id: string; user_id: string; token: string; expires_at: string };

export async function createUser(email: string, password: string, name: string): Promise<UserRow> {
  const pwHash = await hashPassword(password);
  const rows = await query<UserRow>(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email, name, created_at`,
    [email.toLowerCase().trim(), pwHash, name.trim()]
  );
  return rows[0];
}

export async function findUserByEmail(email: string): Promise<(UserRow & { password_hash: string }) | null> {
  return queryOne<UserRow & { password_hash: string }>(
    'SELECT id, email, password_hash, name, created_at FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  );
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  await query(
    `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, sessionExpiry()]
  );
  return token;
}

export async function getSessionUser(token: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    `SELECT u.id, u.email, u.name, u.created_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token]
  );
}

export async function deleteSession(token: string): Promise<void> {
  await query('DELETE FROM sessions WHERE token = $1', [token]);
}

export async function getUserTier(userId: string): Promise<number> {
  const row = await queryOne<{ tier: number }>(
    `SELECT tier FROM subscriptions
     WHERE user_id = $1 AND expires_at > now()
     ORDER BY paid_at DESC LIMIT 1`,
    [userId]
  );
  return row?.tier ?? 0;
}

export const SESSION_COOKIE = 'nr_session';
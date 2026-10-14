import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const COOKIE = 'ks_session';

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error('AUTH_SECRET must be set (min 32 chars)');
  return new TextEncoder().encode(s);
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'cashier';
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret());
}

export async function readSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.id !== 'number' || (payload.role !== 'owner' && payload.role !== 'cashier')) return null;
    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
    if (!user || !user.active) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return readSession(store.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;

export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

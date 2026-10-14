import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
  }
  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !user.active) {
    return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
  }
  const token = await signSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, role: user.role } });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

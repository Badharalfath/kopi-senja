import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

async function requireOwner() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (user.role !== 'owner') return { error: NextResponse.json({ error: 'Owner only.' }, { status: 403 }) };
  return { user };
}

export async function GET() {
  const { error } = await requireOwner();
  if (error) return error;
  const users = await db.user.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const { error } = await requireOwner();
  if (error) return error;

  const { name, email, password, role } = await req.json().catch(() => ({}));
  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama wajib diisi.' }, { status: 400 });
  }
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: 'Email tidak valid.' }, { status: 400 });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 });
  }
  if (role !== 'owner' && role !== 'cashier') {
    return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
  }
  const exists = await db.user.findUnique({ where: { email: cleanEmail } });
  if (exists) return NextResponse.json({ error: 'Email sudah dipakai.' }, { status: 409 });

  const created = await db.user.create({
    data: { name: name.trim(), email: cleanEmail, passwordHash: await bcrypt.hash(password, 10), role },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  return NextResponse.json({ user: created }, { status: 201 });
}

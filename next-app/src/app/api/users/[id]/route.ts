import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
  if (id === user.id) return NextResponse.json({ error: 'Tidak bisa menonaktifkan akun sendiri.' }, { status: 400 });

  const { active } = await req.json().catch(() => ({}));
  if (typeof active !== 'boolean') return NextResponse.json({ error: 'Status tidak valid.' }, { status: 400 });

  const updated = await db.user.update({
    where: { id },
    data: { active },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  return NextResponse.json({ user: updated });
}

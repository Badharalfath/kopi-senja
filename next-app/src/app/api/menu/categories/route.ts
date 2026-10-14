import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });

  const { name } = await req.json().catch(() => ({}));
  const slug = typeof name === 'string' ? name.trim().toLowerCase().replace(/\s+/g, '-') : '';
  if (!slug) return NextResponse.json({ error: 'Nama kategori wajib diisi.' }, { status: 400 });
  const category = await db.category.upsert({
    where: { name: slug },
    update: { active: true },
    create: { name: slug },
  });
  return NextResponse.json({ category: { id: category.id, name: category.name } }, { status: 201 });
}

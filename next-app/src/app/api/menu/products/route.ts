import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'owner') return NextResponse.json({ error: 'Owner only.' }, { status: 403 });

  const { name, category, price } = await req.json().catch(() => ({}));
  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Nama item wajib diisi.' }, { status: 400 });
  }
  if (typeof price !== 'number' || price <= 0) {
    return NextResponse.json({ error: 'Harga harus lebih dari 0.' }, { status: 400 });
  }
  const catName = typeof category === 'string' && category.trim() ? category.trim().toLowerCase() : 'coffee';
  const cat = await db.category.upsert({
    where: { name: catName },
    update: {},
    create: { name: catName },
  });
  const product = await db.product.create({
    data: { name: name.trim(), price: Math.round(price), categoryId: cat.id },
    select: { id: true, name: true, price: true, categoryId: true },
  });
  return NextResponse.json({ product: { ...product, category: cat.name } }, { status: 201 });
}

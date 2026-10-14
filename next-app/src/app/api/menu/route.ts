import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      products: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, price: true, categoryId: true },
      },
    },
  });
  return NextResponse.json({ categories });
}

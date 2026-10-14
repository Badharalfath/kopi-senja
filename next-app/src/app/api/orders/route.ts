import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

const METHODS = ['cash', 'qris', 'transfer', 'card'] as const;

function genCode(): string {
  return 'S-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = genCode();
    const exists = await db.order.findUnique({ where: { code } });
    if (!exists) return code;
  }
  return 'S-' + Date.now().toString(36).toUpperCase().slice(-6);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await db.order.findMany({
    where: user.role === 'owner' ? {} : { cashierId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      items: { include: { product: { select: { name: true } } } },
      payments: { orderBy: { createdAt: 'asc' } },
    },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.code,
      items: o.items.map((i) => ({ id: i.productId, name: i.product.name, price: i.priceAtSale, qty: i.qty })),
      subtotal: o.items.reduce((s, i) => s + i.subtotal, 0),
      discount: o.discountAmount,
      total: o.totalAmount,
      method: o.payments[0]?.method ?? 'cash',
      notes: o.notes,
      time: o.createdAt,
      cashGiven: o.payments[0]?.cashGiven ?? undefined,
      change: o.payments[0]?.changeGiven ?? undefined,
    })),
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items : [];
  const discountPct = typeof body.discountPct === 'number' ? Math.min(100, Math.max(0, body.discountPct)) : 0;
  const method = body.method;

  if (!METHODS.includes(method)) return NextResponse.json({ error: 'Metode bayar tidak valid.' }, { status: 400 });
  if (items.length === 0) return NextResponse.json({ error: 'Keranjang kosong.' }, { status: 400 });

  const clean: { productId: number; qty: number; notes?: string }[] = items
    .map((i: { productId?: number; qty?: number; notes?: string }) => ({
      productId: Number(i.productId),
      qty: Math.floor(Number(i.qty)),
      notes: typeof i.notes === 'string' ? i.notes.slice(0, 200) : undefined,
    }))
    .filter((i: { productId: number; qty: number }) => Number.isInteger(i.productId) && Number.isInteger(i.qty) && i.qty > 0);
  if (clean.length === 0) return NextResponse.json({ error: 'Item tidak valid.' }, { status: 400 });

  const productIds: number[] = [...new Set(clean.map((i: { productId: number }) => i.productId))];
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true, name: true, price: true },
  });
  if (dbProducts.length !== productIds.length) {
    return NextResponse.json({ error: 'Ada item yang tidak tersedia.' }, { status: 400 });
  }
  const priceOf = new Map(dbProducts.map((p) => [p.id, p]));
  const subtotal = clean.reduce((s: number, i: { productId: number; qty: number }) => s + priceOf.get(i.productId)!.price * i.qty, 0);
  const discount = Math.round((subtotal * discountPct) / 100);
  const total = subtotal - discount;

  const cashGiven = typeof body.cashGiven === 'number' ? Math.round(body.cashGiven) : undefined;
  if (method === 'cash' && (cashGiven === undefined || cashGiven < total)) {
    return NextResponse.json({ error: 'Uang tunai kurang dari total.' }, { status: 400 });
  }
  const change = method === 'cash' ? cashGiven! - total : undefined;

  const shift = await db.shift.findFirst({
    where: { cashierId: user.id, status: 'open' },
    orderBy: { openedAt: 'desc' },
  });

  const code = await uniqueCode();
  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        code,
        cashierId: user.id,
        shiftId: shift?.id,
        notes: typeof body.notes === 'string' ? body.notes.slice(0, 500) : undefined,
        discountAmount: discount,
        totalAmount: total,
        status: 'completed',
      },
    });
    for (const i of clean) {
      const p = priceOf.get(i.productId)!;
      await tx.orderItem.create({
        data: {
          orderId: created.id,
          productId: p.id,
          qty: i.qty,
          priceAtSale: p.price,
          subtotal: p.price * i.qty,
          notes: i.notes,
        },
      });
    }
    await tx.payment.create({
      data: {
        orderId: created.id,
        method,
        amount: total,
        cashGiven: method === 'cash' ? cashGiven : undefined,
        changeGiven: method === 'cash' ? change : undefined,
      },
    });
    return tx.order.findUniqueOrThrow({
      where: { id: created.id },
      include: {
        items: { include: { product: { select: { name: true } } } },
        payments: true,
      },
    });
  });

  return NextResponse.json(
    {
      order: {
        id: order.code,
        items: order.items.map((i) => ({ id: i.productId, name: i.product.name, price: i.priceAtSale, qty: i.qty })),
        subtotal,
        discount,
        total,
        method: order.payments[0].method,
        notes: order.notes,
        time: order.createdAt,
        cashGiven: order.payments[0].cashGiven ?? undefined,
        change: order.payments[0].changeGiven ?? undefined,
      },
    },
    { status: 201 }
  );
}

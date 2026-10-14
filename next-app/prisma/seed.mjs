import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MENU = [
  ['coffee', ['Iced Latte|14000', 'Hot Latte|12000', 'Cold Brew|14000', 'Espresso|10000', 'Americano|11000', 'Caramel Macchiato|15000', 'Vanilla Latte|14000', 'Matcha Latte|16000', 'Mocha|15000']],
  ['tea', ['Thai Tea|12000', 'Green Tea|10000', 'Chai Latte|13000', 'Iced Lemon Tea|11000']],
  ['snack', ['Croissant|14000', 'Chocolate Brownie|12000', 'Cheese Cake|13000', 'Egg Sandwich|18000', 'Tuna Sandwich|19000']],
];

async function main() {
  const ownerPass = await bcrypt.hash('owner123', 10);
  const cashierPass = await bcrypt.hash('kasir123', 10);

  await prisma.user.upsert({
    where: { email: 'owner@kopisenja.id' },
    update: { passwordHash: ownerPass, role: 'owner', name: 'Senja Owner' },
    create: { name: 'Senja Owner', email: 'owner@kopisenja.id', passwordHash: ownerPass, role: 'owner' },
  });
  await prisma.user.upsert({
    where: { email: 'kasir@kopisenja.id' },
    update: { passwordHash: cashierPass, role: 'cashier', name: 'Anisa' },
    create: { name: 'Anisa', email: 'kasir@kopisenja.id', passwordHash: cashierPass, role: 'cashier' },
  });

  for (const [catName, items] of MENU) {
    const cat = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
    for (const entry of items) {
      const [name, price] = entry.split('|');
      const existing = await prisma.product.findFirst({ where: { name } });
      if (!existing) {
        await prisma.product.create({ data: { name, price: Number(price), categoryId: cat.id } });
      }
    }
  }

  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
  };
  console.log('Seed done:', JSON.stringify(counts));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

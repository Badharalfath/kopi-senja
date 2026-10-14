# Kopi Senja — Architecture / Contracts (Phase 1)

## Schema Quick Reference (Phase 1 required)
- users, categories, products, orders, order_items, payments, shifts (basic open/close)
- Phase 2 adds: ingredients, recipes, stock_movements
- Phase 3 adds: suppliers, purchases, purchase_items

## Checkout Flow (Core)
1. Cashier opens shift (optional in Phase 1; required Phase 3) → creates `orders`
2. Add items → `orders` (status=open) + `order_items` (price_at_sale frozen)
3. Apply discount → update `orders.discount_amount`
4. Select payment → `payments` (cash/transfer/card)
5. Confirm → DB transaction: insert/update all; if Phase 2, deduct ingredients
6. Print receipt → Blade view with order details; dummy QR for transfer
7. Order status = completed

## Key Constraints (to implement)
- Atomic: DB::transaction around order + payments + stock (Phase 2)
- Price snapshot: `order_items.price_at_sale`
- Shift immutable: middleware checks `shifts.status = closed`
- Role gates: `owner` can approve voids; `cashier` only own orders + open shift
- Dummy QR: static image on receipt (not real payment gateway)

## Phase 1 File Plan
- routes/web.php (auth + menu + checkout + report + receipt)
- controllers: MenuController, PosController, ReportController, ShiftController (basic)
- models: User, Category, Product, Order, OrderItem, Payment, Shift
- migrations: users, categories, products, orders, order_items, payments, shifts
- seeders: users (owner/cashier), categories, products (30 items)
- views: layout/app.blade, menu/index, pos/checkout, reports/daily, receipt/print

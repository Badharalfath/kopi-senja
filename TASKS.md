# Kopi Senja — Task Tracker

## Frontend Prototype — DONE (Next.js, approved)
- [x] F1: Full prototype — workspace, payment modal, QRIS, orders receipts, separated dashboards
- [x] F2: Sidebar nav, category filters, role-separated views, Emil motion pass

## Backend — IN PROGRESS (Next.js API + Prisma + MySQL; supersedes Laravel T1)
- [x] B1: Prisma schema (12 tables) + migrate + seed (users, categories, products)
- [x] B2: Credentials login + JWT cookie session + middleware gates + greeting (replaces role toggle)
- [ ] B3: Menu API (GET/POST/DELETE products + categories, owner only) replacing localStorage menu
- [ ] B4: Orders API (atomic create with items + payments + price snapshot) replacing localStorage orders
- [ ] B5: Shifts API (open/close, reconciliation, immutable closed) replacing local state
- [ ] B6: Phase 2 — ingredients, recipes, stock deduction in order transaction, low-stock

## Phase 1 — MVP (original Laravel plan — superseded by Backend track above)
- [x] T1: Repo on GitHub (Badharalfath/kopi-senja, public)
- [ ] T2: Auth + roles: users (owner, cashier); owner sees all; cashier restricted to checkout + own shift
- [ ] T3: Menu management: categories, products (active/inactive), prices; price history optional
- [ ] T4: POS checkout module: cart, quantity, notes, discount (manual % or fixed), payment (cash, dummy QR, transfer), change calc, printable receipt view
- [ ] T5: Order/line-item model with price-at-sale snapshot; receipt printer CSS / PDF stub
- [ ] T6: Daily sales report: total revenue, item counts, cashier totals, basic total vs cash received (manual entry for Phase 1)

## Phase 2 — Inventory + Recipes
- [ ] T7: Ingredients model (units: gram, ml, pcs) + recipes (product ↔ ingredient qty)
- [ ] T8: Automatic stock deduction on order confirmation (atomic DB transaction)
- [ ] T9: Stock-in (manual) + low-stock alert (threshold per ingredient)
- [ ] T10: Stock movements audit log

## Phase 3 — Shift, Cash, Purchasing, Profit
- [ ] T11: Shifts model (opening_cash, closing_cash, expected_cash, diff, status open/closed, cashier_id)
- [ ] T12: Cash reconciliation: system expects orders + payments; actual closing; diff shown; close immutable
- [ ] T13: Suppliers + purchases + purchase_items (vendor, cost, stock-in impact)
- [ ] T14: Profit reports: revenue - ingredient cost per product; best sellers; sales per cashier
- [ ] T15: Void/refund flow: requires owner approval + reason; audit log entry

## Stretch / Later
- [ ] T16: Real QRIS integration (dummy generator for now)
- [ ] T17: Offline mode / sync queue
- [ ] T18: Multi-branch / warehouse
- [ ] T19: Physical printer support (USB/thermal)

## Blockers / Risks
- None yet. Risk: cash reconciliation logic is business-critical; test with mock data before Phase 3.

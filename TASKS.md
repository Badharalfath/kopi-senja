# Kopi Senja — Task Tracker

## Phase 1 — MVP (Target: complete first vertical slice)
- [ ] T1: Initialize Laravel 11 + MySQL + Tailwind; create repo on GitHub
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

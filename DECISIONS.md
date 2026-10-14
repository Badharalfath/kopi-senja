# Kopi Senja — Decisions

## D1 — Stack (Phase 1)
- **Choice:** Laravel 11 (PHP) + MySQL 8 + Tailwind CSS + Blade (monolith)
- **Rejected:** Separate Next.js frontend for Phase 1 (adds build complexity for 150 tx/day; can split cashier screen later)
- **Rationale:** User explicitly suggested Laravel + MySQL for simplicity; AI model training data for Laravel is extensive; single codebase = easier atomic transactions and role gates. Tailwind allows rapid UI tweaks without CSS build overhead.

## D2 — Authentication & Roles
- **Choice:** Laravel Breeze (or Jetstream if needed) with middleware `role:owner` / `role:cashier`
- **Rule:** Cashier sees only checkout + own shift + basic reports; Owner sees all modules + approvals
- **Rationale:** Simple, built-in, easy to enforce in controllers and Blade views.

## D3 — Database Schema Approach
- **Choice:** Eloquent migrations + seeders for Phase 1; seed with ~30 products, 2 categories, 2 users (owner + cashier)
- **Rule:** All foreign keys enforce referential integrity; orders + payments + stock_movements linked via transaction wrapper
- **Rationale:** Prevents partial writes (sale confirmed but inventory not deducted).

## D4 — Order / Price Snapshot
- **Choice:** `order_items` stores `price_at_sale` (decimal, frozen at order creation); reports reference this column, not current `products.price`
- **Rationale:** User requirement: "later price change doesn't alter old reports."

## D5 — Atomic Sale + Stock Deduction
- **Choice:** DB transaction (`DB::transaction`) around order creation + recipe-based ingredient deduction; if deduction fails, order rolls back
- **Fallback:** If Phase 2 queue needed, use Laravel Queue + database transaction; but for 150 tx/day, sync is fine
- **Rationale:** User requires them to succeed or fail together.

## D6 — Void / Refund
- **Choice:** Soft-delete or status update (`status = voided`) on order; requires `approval_by` (user_id) and `approval_reason` (text); only owner can approve
- **Audit:** Log entry in `stock_movements` if inventory is returned (optional in Phase 3; Phase 1 can block voids for cashiers)

## D7 — Shift / Cash
- **Choice:** `shifts` table with `opened_at`, `closed_at`, `opening_cash`, `closing_cash`, `expected_cash`, `difference`, `cashier_id`, `status`
- **Rule:** Once `status = closed`, controller/middleware blocks edits; only new shift can open
- **Rationale:** User: "A closed shift can't be edited."

## D8 — Dummy QR Generator
- **Choice:** For Phase 1, generate a static QR image with a mock identifier (e.g., `transfer://kopi-senja/transaction/123`) shown on receipt / checkout screen; real QRIS integration in Stretch
- **Rationale:** User asked for dummy QR generator; avoids external payment gateway complexity in MVP.

## D9 — Reports (Phase 1)
- **Choice:** Blade view / basic table; no external BI tool; data from `orders`, `order_items`, `payments`
- **Metrics:** total revenue, orders count, best-selling items (count + revenue), cashier totals
- **Rationale:** Simple, fast, meets MVP need; profit reports come in Phase 3 after cost data exists.

## D10 — Repository / Deployment
- **Choice:** GitHub repo `Badharalfath/kopi-senja`; deploy later via standard Laravel hosting ( Railway / Forge / VPS ); not needed for Phase 1
- **Rationale:** `gh` already connected; allows version control and potential collaboration.

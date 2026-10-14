# Kopi Senja — Product Requirements Document

## 1. Business Context
- **Name:** Kopi Senja
- **Type:** Small coffee shop (retail POS + basic ERP/management)
- **Location:** Single location (multi-branch is Stretch)
- **Traffic:** ~100–150 transactions/day
- **Menu:** ~30 items (coffee, tea, snacks) across categories
- **Ingredients:** beans, milk, syrup, cups, etc. — tracked by unit (gram, ml, pcs)
- **Staff:** 1 owner, 2 cashiers, 1 barista
- **Current pain points:** sales in notebook, cash never matches, ingredients run out unexpectedly, owner doesn't know real profit, wrong discounts untracked

## 2. Goals
- Track sales digitally with role-based access
- Know real-time ingredient stock and get low-stock alerts
- Lock sale prices in reports (historical accuracy)
- Reconcile cash per shift with system expectation
- Give owner visibility into product profitability and cashier performance

## 3. Roles & Permissions
| Role | Capabilities | Restrictions |
|---|---|---|
| Owner | All modules + menu/price management + approve voids + view all reports + manage users | None |
| Cashier | Process checkout + open/close own shift + view basic daily sales + view own orders | No access to purchasing, supplier costs, profit reports; cannot approve voids; cannot edit other shifts |

## 4. Modules

### 4.1 Menu Management (Owner only for edits)
- Categories: name, sort order, active
- Products: name, category_id, price, is_active, notes / description
- Active/inactive toggle; inactive products don't appear in POS but are preserved for reports
- Price changes only affect new orders (snapshot logic)

### 4.2 POS Checkout (Cashier / Owner)
- Cart: add/remove items, adjust quantity, add notes
- Discounts: manual % discount or fixed discount amount; applied before payment; recorded in order
- Payment methods: Cash, Transfer (dummy QR), Card (manual entry for Phase 1)
- Change calculation for cash
- Receipt: printable view with items, quantities, prices, discounts, total, change, timestamp, cashier name, transaction ID
- Dummy QR generator: display mock QR code/symbol on receipt / screen for "transfer" payments (not real QRIS yet)
- Order status: open / completed / voided
- Void/Refund: only owner can approve; requires `approval_reason`; must roll back inventory (Phase 3) or block in Phase 1

### 4.3 Inventory (Phase 2; basic view in Phase 1 if needed)
- Ingredients: name, unit (gram, ml, pcs), current_stock, low_stock_threshold, supplier reference
- Recipes: product_id ↔ ingredient_id + quantity per item (e.g., 1 latte = 30ml milk + 18g coffee + 1 cup)
- Automatic deduction: on order confirmation, deduct recipe quantities (atomic transaction)
- Stock-in (manual): add to ingredient stock with reason/reference
- Low-stock alert: flag ingredients at or below threshold; visible on dashboard
- Stock movements audit: log in/out/adjustment with timestamp, reference (order/purchase/manual), quantity

### 4.4 Purchasing (Phase 3)
- Suppliers: name, contact, active
- Purchases: supplier_id, date, total
- Purchase items: ingredient_id, qty, unit_cost, total_cost
- On save, increases ingredient stock automatically; updates average cost for profit calculations

### 4.5 Shift and Cash (Phase 3; basic open/close in Phase 1 if needed)
- Shifts: cashier_id, opened_at, closing_at, opening_cash (float), closing_cash (float), expected_cash (system calculated from orders + payments in shift), difference, status (open / closed)
- Cashier opens shift with declared opening cash; closes with actual closing cash; system compares to expected
- A closed shift cannot be edited (hard gate: middleware + DB check)
- Only open shift for cashier allows new orders (optional rule)

### 4.6 Reports (Phase 1: basic; Phase 3: full)
- Daily sales: total revenue, order count, total items, average per order
- Best sellers: top products by quantity sold and revenue (using price-at-sale)
- Cashier performance: orders and revenue per cashier (Phase 1 basic; detailed Phase 3)
- Profit per product: revenue - ingredient cost (Phase 3 after purchasing / recipes)
- Stock movement: in / out / adjustments per ingredient
- Sales per cashier: revenue and order count per cashier for shift/day

## 5. Key Business Rules (Implementation Requirements)

### R5.1 Recipe-Based Stock Deduction
- Every product has 1+ recipes.
- When an order is confirmed (`status = completed`), deduct recipe quantities from ingredients.
- Deduction must be inside same DB transaction as order creation.

### R5.2 Atomic Transaction
- `orders` creation + `order_items` insertion + `payments` insertion + `stock_movements` insertion = single DB transaction; rollback on any failure.
- If deduction fails (e.g., not enough stock), order does not complete; cashier sees error.

### R5.3 Price Snapshot
- `order_items.price_at_sale` stores price at time of order creation.
- Reports always reference `price_at_sale`; current `products.price` never retroactively changes old data.

### R5.4 Discount Handling
- Discount applied to order total or per item? For simplicity: discount % or fixed amount applied to order total; recorded in `orders.discount_amount`; receipt shows discount.
- Discount must be recorded; owner can audit after.

### R5.5 Void / Refund (Audit)
- Only owner can approve void or refund.
- Requires `approval_by` (user_id) and `approval_reason` (text, min length, not empty).
- If voided after stock deducted (Phase 3), inventory must be returned (add back); in Phase 1, void can be blocked or only allowed before stock deduction (or just status change with note, no inventory rollback until Phase 3).
- Void creates audit log entry.

### R5.6 Shift Closure Uneditable
- Once `shifts.status = closed`, all controllers block updates/deletes for that record.
- Only new shift can be created for cashier.

### R5.7 Cash Reconciliation
- Expected cash = sum of cash payments in shift (from payments table where method = cash and shift_id matches) + opening cash? Actually expected = opening cash + cash payments received during shift. System calculates from orders/payments linked to shift.
- Difference = actual closing cash - expected cash. Displayed to owner for review.
- Difference can be positive (over) or negative (short); record reason optionally.

### R5.8 Receipt
- Must include: shop name, date/time, cashier, order ID, items (qty, name, price), discount (if any), total, payment method, change, thank-you / contact info.
- Dummy QR: for transfer payments, show mock QR image/code on receipt.

## 6. Core Tables (~12)
- `users`: id, name, email, password_hash, role (owner/cashier), active, timestamps
- `categories`: id, name, sort_order, active
- `products`: id, category_id, name, price, is_active, notes, timestamps
- `ingredients`: id, name, unit (gram/ml/pcs), current_stock, low_stock_threshold, supplier_id (optional), timestamps
- `recipes`: id, product_id, ingredient_id, quantity, timestamps
- `stock_movements`: id, ingredient_id, type (in/out/adjustment), qty, reference_type, reference_id, reason, timestamps
- `suppliers`: id, name, contact, active, timestamps
- `purchases`: id, supplier_id, date, total, notes, timestamps
- `purchase_items`: id, purchase_id, ingredient_id, qty, unit_cost, total_cost, timestamps
- `shifts`: id, cashier_id (user_id), opened_at, closing_at, opening_cash, closing_cash, expected_cash, difference, status, timestamps
- `orders`: id, cashier_id, shift_id (optional Phase 3), customer_name/notes, discount_amount, total_amount, status (open/completed/voided), approval_by (if voided), approval_reason, timestamps
- `order_items`: id, order_id, product_id, qty, price_at_sale, subtotal, notes, timestamps
- `payments`: id, order_id, method (cash/transfer/card), amount, change_given (if cash), timestamp, shift_id (Phase 3)

## 7. Build Phases (Detailed)

### Phase 1 — MVP (First delivery)
1. Setup Laravel 11 + MySQL; create repo
2. Auth + roles (owner, cashier); seed users
3. Menu management (categories, products)
4. POS checkout: cart, quantity, notes, discount, payment (cash, dummy QR), change calc, receipt
5. Order creation with price snapshot (`order_items.price_at_sale`)
6. Daily sales report (revenue, best items, cashier totals)

**Phase 1 Acceptance:** Owner can add product, cashier can process 10 orders with cash, receive correct receipt, and see daily total.

### Phase 2 — Inventory + Recipes
1. Ingredients + recipes
2. Auto deduction on order confirmation (transaction wrapper)
3. Stock-in manual + low-stock alerts
4. Stock movements audit

**Phase 2 Acceptance:** Selling 5 lattes reduces milk and coffee stock correctly; low-stock alert appears when milk < threshold.

### Phase 3 — Shift, Cash, Purchasing, Profit
1. Shifts (open/close, cash reconciliation, immutable closed)
2. Purchasing (suppliers, purchase records, stock-in)
3. Void/refund with owner approval + reason
4. Profit reports (product-level), best sellers, cashier performance

**Phase 3 Acceptance:** Cashier opens shift, processes orders, closes with correct cash; owner views profit per latte; void requires approval.

## 8. Technical Approach (from Decisions)
- Laravel 11, Blade, Tailwind, Eloquent, MySQL
- DB transactions (`DB::transaction`) for atomic operations
- Middleware for role checks (`auth`, `role:owner`, `role:cashier`, `shift:open`)
- Receipt as printable Blade view (CSS print media) + PDF stub using `barryvdh/laravel-dompdf` if needed
- Dummy QR: static SVG/PNG generated with `simplesoftwareio/simple-qrcode` using mock text (e.g., `transfer://kopi/tx/123`); not real bank QRIS
- Tests: PHPUnit feature tests for checkout flow, stock deduction, shift close gate, void approval

## 9. Success Metrics (for this build)
- Phase 1 complete within scope (login, menu, checkout, receipt, daily report)
- Phase 2 complete with atomic deduction demonstrated
- Phase 3 complete with shift reconciliation and profit report shown
- All business rules implemented with tests or manual evidence

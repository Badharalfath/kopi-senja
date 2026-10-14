# Kopi Senja — Project State

## Identity
- **Project:** Kopi Senja (small coffee shop POS / ERP)
- **Context:** ~100–150 transactions/day, ~30 menu items, 1 owner + 2 cashiers + 1 barista
- **Working directory:** /Users/alfatih/CodingProjects/padel-test/ (dedicated project folder)
- **Repo (planned):** Badharalfath/kopi-senja (to be created via gh)

## Status
- PRD received and parsed (full scenario + modules + business rules + 12-core-table schema + 3-phase build plan)
- Stack decision: Laravel + MySQL + Tailwind CSS (monolith, Phase 1); cashier screen can split to Next.js later (Phase 2+)
- GitHub CLI verified connected (Badharalfath, scopes incl. repo)
- Phase 1 (MVP) not yet started — waiting for workspace init and first task

## Decisions Made (see DECISIONS.md)
- Stack: Laravel 11 / MySQL 8 / Tailwind / Laravel Breeze/Jetstream for auth (owner/cashier roles)
- Atomic transactions required for order + inventory deduction (DB transaction wrapper + queue fallback if needed)
- Price snapshot in order_items (not referenced to product price at report time)
- Void/refund requires owner approval + reason text (audit trail)
- Closed shift is immutable after close (hard DB constraint / app-level gate)
- Dummy QR generator for Phase 1 (real QRIS integration is Stretch)

## Constraints / Non-Negotiables (from user scenario)
1. Recipe-based stock deduction (ingredients per product)
2. Sale + stock deduction must be atomic (all succeed or all fail)
3. Price at time of sale locked in order_items
4. Void/refund requires owner approval + reason
5. Shift close is final (no edits)
6. Cash reconciliation compares system expected vs actual closing cash

## Build Phases
- Phase 1 (MVP): login/roles, menu management, POS checkout (cash / dummy QR), receipt, daily sales report
- Phase 2: ingredients/recipes, auto stock deduction, stock-in, low-stock alerts
- Phase 3: shift/cash reconciliation, purchasing, profit reports (per product, per cashier)
- Stretch: real QRIS integration, offline mode, multi-branch, printer support

## Key Tables (~12)
users, categories, products, ingredients, recipes, stock_movements, suppliers, purchases, purchase_items, shifts, orders, order_items, payments

## Current Focus
Initialize workspace, create PRD file, begin Phase 1 database schema + auth.

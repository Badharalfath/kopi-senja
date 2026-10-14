# DESIGN.md — Kopi Senja (Next.js Full Prototype)

## Theme: Minimal, accessible, user-centered — no decorative glow
- Font: Space Grotesk (wider, geometric, readable) + JetBrains Mono (data)
- Background: #F7F6F3 (bone), surface white, hairline borders only
- No gradients, no underglow, no oversized serif for UI labels
- Cards: uniform size, clean 1px borders, generous whitespace
- Role separation: Owner and Cashier get completely different pages/views

## Components
- Header: role indicator + role switch (dropdown or login selection)
- POS: cart, checkout, receipt generation (live data)
- Menu: add/edit/deactivate (owner) / read (cashier)
- Reports: separate pages, live from session data

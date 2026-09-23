# Simple Next.js Store

## Testing

This application uses a testing pyramid rather than repeating the same assertion at every level:

- **Jest** validates Zod form rules, formatting, and isolated route/action behavior quickly.
- **React Testing Library** covers customer-visible client behavior: signing in to add an item, revealing the review form, and checkout totals.
- **Playwright** exercises public browser routes and has an opt-in product-detail journey against a real, seeded test environment.

Run the suite with:

```bash
npm test
npm run test:coverage
npm run test:e2e
```

Install the browser once before running Playwright locally:

```bash
npx playwright install chromium
```

Copy `.env.example` to `.env.local` and supply only development/test credentials. Never use production database, Clerk, Supabase, or Stripe values. The Jest route tests mock Prisma and Stripe, so they do not contact external services or charge cards.

`PLAYWRIGHT_PRODUCT_ID` enables the product-detail scenario. It must identify a product in a disposable seeded test database. The authenticated cart, order, and embedded Stripe checkout journeys are intentionally not run with ordinary local credentials: they require dedicated Clerk test accounts, isolated database cleanup, and Stripe test-mode configuration. When those are available, add an authenticated Playwright storage-state setup that reads `E2E_CLERK_USER_EMAIL` and `E2E_CLERK_USER_PASSWORD`; do not commit credentials or authentication-state files.

### Architecture notes

Catalog, cart, favorites, and orders are Server Components backed by Prisma. They are covered through server-action/route tests or browser tests instead of forcing them through a client-component renderer. Stripe is tested as a route-handler integration with a mocked SDK; confirmation asserts order/cart mutations but never contacts Stripe. The current application keeps cart-total calculation inside `updateCart`; extracting that calculation into a pure function would be the next high-value unit-test seam.

Coverage is a quality signal, not a release threshold. Generated UI primitives, Next runtime wiring, Clerk-hosted authentication pages, the live PostgreSQL connection, Supabase uploads, and Stripe's embedded iframe are intentionally excluded from this fast suite.

### Recommended CI order

1. `npx tsc --noEmit`
2. `npm test`
3. `npm run build`
4. Start a disposable, seeded test deployment and run `npm run test:e2e` with test-only environment variables.

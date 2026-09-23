import { expect, test } from '@playwright/test';

test('visitor can open the public about page', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
});

test('visitor can browse a configured product detail page', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_PRODUCT_ID, 'Set PLAYWRIGHT_PRODUCT_ID to a seeded product ID for catalog E2E coverage.');
  await page.goto(`/products/${process.env.PLAYWRIGHT_PRODUCT_ID}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /add to cart|please sign in/i })).toBeVisible();
});

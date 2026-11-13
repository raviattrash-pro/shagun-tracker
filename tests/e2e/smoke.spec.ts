import { test, expect } from '@playwright/test';

test.describe('Shagun Tracker E2E Smoke Tests', () => {
  test('homepage and dashboard load cleanly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Shagun Tracker/i);
    await expect(page.locator('header')).toBeVisible();
  });

  test('login page loads and displays authentication options', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Shagun Tracker').or(page.locator('text=शगुन ट्रैकर'))).toBeVisible();
  });

  test('public gift registry loads', async ({ page }) => {
    await page.goto('/registry');
    await expect(page.locator('body')).toBeVisible();
  });
});

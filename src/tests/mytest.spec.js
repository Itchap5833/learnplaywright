import { test, expect } from '@playwright/test';


test('My first test', async ({ page }) => {
  await page.goto('https://www.google.com/ncr');

  await page.locator('input[name="q"]').fill('Playwright');

  await page.keyboard.press('Enter')

  await page.waitForTimeout(1000);

  const results = await page.locator('h3').allTextContents();

  expect(results.length).toBeGreaterThan(0);

});

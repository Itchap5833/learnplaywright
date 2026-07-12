import { test, expect, Locator } from '@playwright/test';

// npm run test:chrome:saucedemo

test('My first test', async ({ page }) => {
  await page.waitForTimeout(1000); // to slow down execution by 1 second so that steps are visible in headed mode
  await page.goto('https://www.saucedemo.com/');

  const username: Locator = page.locator('input[id="user-name"]');
  const password: Locator = page.locator('input[id="password"]');
  const loginButton: Locator = page.locator('input[id="login-button"]');

  await username.fill('standard_user');
  await password.fill('secret_sauce');
  await loginButton.click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  const title: Locator = page.locator('.title');

  await expect(title).toHaveText('Products');

});

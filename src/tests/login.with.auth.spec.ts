import { test, expect } from '../fixtures/auth-fixture';

// npm test -- src/tests/login.with.auth.spec.ts

// we have updated the test to use the auth-fixture, which will automatically load the saved storage state for the user. 
// This means that we don't need to log in again, and we can directly access the inventory page.

// Also, we have updated the playwright.config.ts file to include a globalSetup script that will run before any tests are executed. 
// This script will authenticate the user and save the storage state, which will be used by the auth-fixture.

// Defaule file path where the storage state is saved: .auth/user.json

test('should reuse saved auth state and open inventory page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
});

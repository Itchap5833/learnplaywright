import { test, expect, problemUserAuthFile } from '../fixtures/auth-fixture';

// Run this spec with the saved problem_user auth state.
test.use({ storageState: problemUserAuthFile });

test('should reuse saved problem_user auth state and open inventory page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  const title = page.locator('.title');
  await expect(title).toHaveText('Products');
});

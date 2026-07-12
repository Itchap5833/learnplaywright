import { expect } from '@playwright/test';
import { test } from '../fixtures/my-extended-test';

// npm test -- login.fixture.demo.spec.ts --project=chromium 
test('should login using my-extended-test fixture', async ({ loginPage }) => {
  await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/inventory.html');

  const title = loginPage.page.locator('.title');
  await expect(title).toHaveText('Products');
});

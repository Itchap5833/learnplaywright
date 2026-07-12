import { test, expect } from '@playwright/test';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';
import fs from 'fs';
import path from 'path';

// npm test -- src/tests/auth.setup.spec.ts
test('authenticate user and save storage state', async ({ page }) => {
  const loginPage = new LoginPageSauceDemo(page);
  await loginPage.navigate();
  await loginPage.loginAsStandardUser();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  const authDir = path.join(process.cwd(), '.auth');
  fs.mkdirSync(authDir, { recursive: true });
  await page.context().storageState({ path: path.join(authDir, 'user.json') });
});
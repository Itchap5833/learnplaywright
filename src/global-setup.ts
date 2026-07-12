import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPageSauceDemo } from './pages/loginpagesaucedemo.page';

const authDir = path.join(process.cwd(), '.auth');

const users = [
  { username: 'standard_user', file: 'standard_user.json' },
  { username: 'problem_user', file: 'problem_user.json' },
];

async function createAuthState(username: string, destination: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPageSauceDemo(page);
  await loginPage.navigate();
  await loginPage.login(username, 'secret_sauce');
  await page.waitForURL('https://www.saucedemo.com/inventory.html');

  await context.storageState({ path: destination });
  await browser.close();
}

async function globalSetup() {
  fs.mkdirSync(authDir, { recursive: true });

  for (const user of users) {
    const userStateFile = path.join(authDir, user.file);
    await createAuthState(user.username, userStateFile);
  }

  const defaultAuthFile = path.join(authDir, 'user.json');
  const standardUserFile = path.join(authDir, 'standard_user.json');
  fs.copyFileSync(standardUserFile, defaultAuthFile);
}

export default globalSetup;

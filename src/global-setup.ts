import { chromium, firefox, webkit, BrowserType } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPageSauceDemo } from './pages/loginpagesaucedemo.page';
import { PasswordUtils } from './utils/password-utils';
import { readData } from './utils/dataReader';


const authDir = path.join(process.cwd(), '.auth');

const testData = readData('./src/tests/test-data/LoginDataSecret.csv');

const users = [
  { username: 'standard_user', file: 'standard_user.json' },
  { username: 'problem_user', file: 'problem_user.json' },
];

const browsers = [
  { name: 'chromium', type: chromium },
  { name: 'firefox', type: firefox },
  { name: 'webkit', type: webkit },
];

const encryptedPasswordMap: Record<string, string> = {
  standard_user:'',
  problem_user:'',
};

async function generateEncryptedPasswords() {
  for (const data of testData) {
    if (data.run === 'yes') {
      console.log(`Generating encrypted password for ${data.username}`);
      console.log(`Encrypted password is ${data.password}`);
      encryptedPasswordMap[data.username] = data.password;
    if (!encryptedPasswordMap[data.username]) {
      throw new Error(`No encrypted password configured for "${data.username}"`);
    }
    }
  }
}

async function createAuthState(
  browserType: BrowserType,
  username: string,
  destination: string
) {
  const browser = await browserType.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPageSauceDemo(page);
  await loginPage.navigate();


  const encryptedPassword = encryptedPasswordMap[username];
  if (!encryptedPassword) {
    throw new Error(`No encrypted password configured for "${username}"`);
  }

  const password = PasswordUtils.decryptPassword(encryptedPassword);

  console.log(`Logging in as ${username} with decrypted password: ${password}`);
  await loginPage.login(username, password);
  await page.waitForURL('https://www.saucedemo.com/inventory.html');

  await context.storageState({ path: destination });
  await browser.close();
}

async function globalSetup() {
  fs.mkdirSync(authDir, { recursive: true });

  await generateEncryptedPasswords();

  for (const browser of browsers) {
    for (const user of users) {
      const browserUserStateFile = path.join(authDir, `${browser.name}-${user.file}`);
      await createAuthState(browser.type, user.username, browserUserStateFile);

      if (browser.name === 'chromium' && user.username === 'standard_user') {
        const defaultAuthFile = path.join(authDir, 'user.json');
        fs.copyFileSync(browserUserStateFile, defaultAuthFile);
      }
      if (browser.name === 'chromium' && user.username === 'problem_user') {
        const defaultProblemAuthFile = path.join(authDir, 'problem_user.json');
        fs.copyFileSync(browserUserStateFile, defaultProblemAuthFile);
      }
    }
  }
}

export default globalSetup;

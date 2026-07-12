import { expect, test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';
import path from 'path';
import { readData } from '../utils/dataReader';

// npx playwright test src/tests/login.data-driven.parallel.spec.ts -- project=chromium --headed --workers=1
const dataSources = [
  { label: 'CSV', file: path.join(__dirname, 'test-data', 'LoginData.csv') },
  { label: 'XLSX', file: path.join(__dirname, 'test-data', 'LoginData.xlsx') },
  { label: 'JSON', file: path.join(__dirname, 'test-data', 'loginDataNew.json') },
];

const testData = dataSources.flatMap((source) => {
  const data = readData(source.file, 'Sheet1') as Array<{
    username: string;
    password: string;
    expected: string;
    run: string;
  }>;

  return data.map((row) => ({
    ...row,
    source: source.label,
    sourceFile: path.basename(source.file),
  }));
});

test.describe.parallel('Data-driven login cases using CSV/JSON/XLSX', () => {
  for (const data of testData) {
    test(`${data.source} - ${data.username}`, async ({ page }) => {
      test.skip(data.run !== 'yes', 'Run flag is not yes');

      const loginPage = new LoginPageSauceDemo(page);
      await test.step('Go to login page', async () => {
        await loginPage.navigate();
      });

      await test.step('Perform login', async () => {
        await loginPage.login(data.username, data.password);
      });

      await test.step('Validate outcome', async () => {
        if (data.expected === 'success') {
          await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        } else {
          await expect(loginPage.errorMessage).toBeVisible();
        }
      });
    });
  }
});

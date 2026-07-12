import { expect, test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';

import { readExcel, LoginData } from '../utils/excelReader';

const testData: LoginData[] = readExcel('./src/tests/test-data/LoginData.xlsx', 'Sheet1');

test.describe('Login Tests for excel reader', () => {

    for (const data of testData) {

        // if (data.run !== 'yes') continue;

        test(`Login test for - ${data.username}`, async ({ page }) => {

            test.skip(data.run !== 'yes', 'Run Flag=NO');

            const loginPage = new LoginPageSauceDemo(page);

            await test.step('Go to login page', async () => {
                await loginPage.navigate();
            });

            await test.step('Perform Login', async () => {
                await loginPage.login(data.username, data.password);
            });

            await test.step('Validate Result', async () => {
                if (data.expected === 'success') {
                    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
                } else {
                    await expect(loginPage.errorMessage).toBeVisible();
                }
            });
        });
    }

});
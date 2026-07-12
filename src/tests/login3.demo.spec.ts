import { expect, test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';
import loginData from './test-data/loginDataNew.json';

// npx playwright test src/tests/login3.demo.spec.ts --project=chromium --headed --workers=1

test.describe('Login Tests for csv reader', () => {

   for (const data of loginData) {
    test(`Login Test - ${data.username}`, async ({ page }) => {
        test.skip(data.run !== 'yes', 'Run Flag=NO');

        const loginPage = new LoginPageSauceDemo(page);
        await loginPage.navigate();
        await loginPage.login(data.username, data.password);

        if (data.expected === 'success') {
            await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        } else {
            await expect(loginPage.errorMessage).toBeVisible();
        }

    });
}

});
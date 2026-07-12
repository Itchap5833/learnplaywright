import { test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';
import loginData from '../tests/test-data/loginData.json';

// npx playwright test src/tests/login2.demo.spec.ts --project=chromium --headed --workers=1

// at top of src/tests/login2.demo.spec.ts
//test.describe.configure({ mode: 'parallel' });
//npx playwright test src/tests/login2.demo.spec.ts --workers=2 --project=chromium --headed

//Run tests in separate files (simplest)
//npx playwright test --workers=2 --headed

test.describe('Login Test Data Driven', () => {
  test('should login with valid user data driven', async ({ page }) => {
    const loginPage = new LoginPageSauceDemo(page);
    await loginPage.navigate();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await loginPage.verifyLoginSuccess();
  });

  test('should login with invalid user data driven', async ({ page }) => {
    const loginPage = new  LoginPageSauceDemo(page);
    await loginPage.navigate();
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    await loginPage.errorMessage.isVisible();
  });

});
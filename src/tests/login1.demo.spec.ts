import { test } from '../test-setup';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';

// npm run test:chrome:google     

test.describe('Google search', () => {
  test('should search for learn playwright and open the first result', async ({ page }) => {
    const loginPage = new LoginPageSauceDemo(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
  });
});

// fixtures/my-extended-test.js
import { test as base } from '@playwright/test';
import { LoginPageSauceDemo } from '../pages/loginpagesaucedemo.page';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const sauseLogin = new LoginPageSauceDemo(page);
    await sauseLogin.navigate();
    await sauseLogin.loginAsStandardUser();
    await sauseLogin.verifyLoginSuccess();

    await use(sauseLogin); // provide this fixture object to the test, then resume after the test completes.”

    //use(...) is the function provided by Playwright fixture extension
    //sauseLogin becomes available to the test as the loginPage fixture
    //the test runs after this line

    // my-extended-test.js is like hiring a Magic Butler.

    // You teach the butler one time inside my-extended-test.js: "Hey, whenever I ask for the loginPage, 
    // I need you to open the browser, type the username and password, and click log in for me."

    // Optional teardown logic goes here
  },
});

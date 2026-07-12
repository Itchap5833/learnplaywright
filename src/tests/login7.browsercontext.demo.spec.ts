import { expect, test } from '../test-setup';



test('Login Tests for excel reader using unified approach', async ({ browser }) => {

const users = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' }
  ];

  for (const user of users) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[id="user-name"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('input[id="login-button"]');
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    await context.close();
  }

});
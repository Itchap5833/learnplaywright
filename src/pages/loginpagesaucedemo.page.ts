import { expect, Locator, Page } from '@playwright/test';


export class LoginPageSauceDemo {

readonly page: Page;
readonly usernameInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;
readonly errorMessage: Locator;


constructor(page: Page) {
  this.page = page;
  this.usernameInput = page.locator('input[id="user-name"]');
  this.passwordInput = page.locator('input[id="password"]');
  this.loginButton = page.locator('input[id="login-button"]');
  this.errorMessage = page.locator('[data-test="error"]');

}

async navigate() {
  await this.page.goto('https://www.saucedemo.com/');
}


async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}

async loginAsStandardUser() {
  await this.login('standard_user', 'secret_sauce');
}

async loginAsLockedOutUser() {
  await this.login('locked_out_user', 'secret_sauce');
}

async getErrorMessage(): Promise<string> {
  return (await this.errorMessage.textContent())?.trim() ?? '';
}

async isLoggedIn(): Promise<boolean> {
  return this.page.url().includes('/inventory.html');
}

async verifyLoginSuccess() {
  await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
  const title: Locator = this.page.locator('.title');
  await expect(title).toHaveText('Products');
}

}



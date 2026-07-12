import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading = page.locator('h1');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async expectHeroHeading() {
    await expect(this.heroHeading).toBeVisible();
  }
}

import { expect, Locator, Page } from '@playwright/test';

export class GoogleSearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly botChallenge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[name="q"], textarea[name="q"], [name="q"]');
    this.searchResults = page.locator('div#search a h3, .g a h3, #search h3');
    this.botChallenge = page.locator(
      'text=/unusual traffic/i, text=/are you a robot/i, text=/sorry/i, text=/detected unusual traffic/i'
    );
  }

  async navigate() {
    await this.page.context().clearCookies();
    await this.page.context().setExtraHTTPHeaders({
      'Accept-Language': 'en-IN,en;q=0.9',
    });

    await this.page.goto('https://www.google.co.in/ncr?gl=IN&hl=en', { waitUntil: 'networkidle' });
    await this.acceptConsentIfVisible();
    await this.waitForSearchInput();
  }

  private async detectBotChallenge() {
    if (await this.botChallenge.isVisible({ timeout: 5_000 }).catch(() => false)) {
      throw new Error(
        'Google bot/challenge page detected. This test needs a human session or a less-detectable browser profile.'
      );
    }
  }

  private async acceptConsentIfVisible() {
    const consentButton = this.page.locator(
      'button:has-text("I agree"), button:has-text("Accept all"), button:has-text("AGREE"), button:has-text("Accept all cookies")'
    );

    if (await consentButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await consentButton.click();
      await this.page.waitForLoadState('networkidle');
      return;
    }

    // Try inside any iframes (Google often places consent in an iframe)
    const frames = this.page.frames();
    for (const f of frames) {
      try {
        const fb = f.locator('button:has-text("I agree"), button:has-text("Accept all")');
        if (await fb.isVisible({ timeout: 1_000 }).catch(() => false)) {
          await fb.click();
          await this.page.waitForLoadState('networkidle');
          return;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  private async waitForSearchInput() {
    await expect(this.searchInput).toBeVisible({ timeout: 20_000 });
    await expect(this.searchInput).toBeEnabled({ timeout: 20_000 });
  }

  async search(query: string) {
    await this.waitForSearchInput();
    await this.detectBotChallenge();

    // Human-like interaction: focus and type with delay
    try {
      await this.searchInput.first().click({ delay: 100 });
    } catch (e) {
      // fallback to focus
      await this.searchInput.first().focus();
    }

    await this.page.keyboard.type(query, { delay: 120 });
    await this.page.keyboard.press('Enter');

    // Wait for either search results or a bot/challenge page
    await Promise.race([
      expect(this.searchResults.first()).toBeVisible({ timeout: 30_000 }),
      this.botChallenge.waitFor({ state: 'visible', timeout: 30_000 }),
    ]).catch(async (error) => {
      if (await this.botChallenge.isVisible().catch(() => false)) {
        throw new Error(
          'Google bot/challenge page detected after search. Try using a persistent browser profile or a different network.'
        );
      }
      throw error;
    });
  }

  async clickFirstResult() {
    const firstResult = this.searchResults.first();
    await expect(firstResult).toBeVisible({ timeout: 30_000 });
    if (await this.botChallenge.isVisible().catch(() => false)) {
      throw new Error('Cannot click first result because a Google bot/challenge page is visible.');
    }
    await firstResult.scrollIntoViewIfNeeded();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      firstResult.click({ delay: 50 }),
    ]);
  }
}

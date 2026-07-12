import { test as base, expect as baseExpect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = process.env.PERSISTENT_USER_DIR || path.join(process.cwd(), 'user-data');
const commonLaunchOptions = {
  headless: false,
  locale: 'en-IN',
  viewport: { width: 1280, height: 720 },
  ignoreHTTPSErrors: true,
  bypassCSP: true,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--disable-features=IsolateOrigins,site-per-process',
    '--no-sandbox',
  ],
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

export const test = base.extend({
  context: async ({ browserName, playwright }, use) => {
    // Ensure a per-browser user-data directory so profiles persist across runs
    const browserDir = path.join(USER_DATA_DIR, `${browserName || 'chromium'}-${process.pid}`);
    fs.mkdirSync(browserDir, { recursive: true });

    const browserType = playwright[browserName || 'chromium'];
    const context = await browserType.launchPersistentContext(browserDir, {
      ...commonLaunchOptions,
    });

    // Inject small stealth scripts at context creation
    await context.addInitScript(() => {
      try {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
      } catch (e) {}
      try {
        // @ts-ignore
        window.chrome = window.chrome || {};
      } catch (e) {}
      try {
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      } catch (e) {}
    });

    await use(context);

    try {
      await context.close();
    } catch (e) {
      // ignore close errors
    }
  },
});

export const expect = baseExpect;

export default test;

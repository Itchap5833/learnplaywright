import { test, expect } from '../fixtures/auth-page-fixture';

// npm test -- src/tests/login.with.authpage.spec.ts

test('should use authPage fixture and access inventory after login', async ({ authPage }) => {
  const title = authPage.page.locator('.title');
  await expect(title).toHaveText('Products');
});

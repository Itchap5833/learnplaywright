import { test } from '../test-setup';
import { GoogleSearchPage } from '../pages/google.page';

// npm run test:chrome:google     

test.describe('Google search', () => {
  test('should search for learn playwright and open the first result', async ({ page }) => {
    const google = new GoogleSearchPage(page);

    await google.navigate();
    await google.search('learn playwright');
    await google.clickFirstResult();
  });
});

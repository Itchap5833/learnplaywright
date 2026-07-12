//import { test, expect } from '@playwright/test';
import { test, expect } from '../fixtures/auth-page-fixture';
import { InventoryPageSauceDemo } from '../pages/inventory.page';
import { readData } from '../utils/dataReaderTyped';

export type InventoryData = {
  productName: string;
  expectedDescription: string;
  expectedPrice: string;
};

const inventoryData = readData<InventoryData>('./src/tests/test-data/inventoryData.csv');

// npm test -- src/tests/inventory.spec.ts --headed --workers=1 --project=chromium

test.describe('Sauce Demo Inventory page operations', () => {
  let inventoryPage: InventoryPageSauceDemo;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPageSauceDemo(page);
    await inventoryPage.goto();
    await inventoryPage.verifyInventoryPage();
  });

  for (const data of inventoryData) {
    test(`should verify product details and add/remove item from cart - ${data.productName}`, async () => {
      await expect(inventoryPage.getProductTitle(data.productName)).toHaveText(data.productName);
      await expect(inventoryPage.getProductDescription(data.productName)).toContainText(data.expectedDescription);
      await expect(inventoryPage.getProductPrice(data.productName)).toHaveText(data.expectedPrice);

      await inventoryPage.addToCart(data.productName);
      await expect(inventoryPage.getRemoveButton(data.productName)).toBeVisible();
      expect(await inventoryPage.getCartCount()).toBe(1);

      await inventoryPage.removeFromCart(data.productName);
      await expect(inventoryPage.getAddToCartButton(data.productName)).toBeVisible();
      expect(await inventoryPage.getCartCount()).toBe(0);
    });
  }

  test('should sort products by price low to high', async () => {
    await inventoryPage.selectSortOption('Price (low to high)');
    await expect(inventoryPage.filterSelect).toHaveValue('lohi');
  });

  test('should open menu and go to cart page', async () => {
    await inventoryPage.openMenu();
    await expect(inventoryPage.page.getByRole('button', { name: /close menu/i })).toBeVisible();

    await inventoryPage.closeMenu();

    await expect(inventoryPage.page.getByRole('button', { name: /open menu/i })).toBeVisible();

    await inventoryPage.goToCart();

    await expect(inventoryPage.page).toHaveURL(/\/cart\.html$/);
    await expect(inventoryPage.page.locator('span.title[data-test="title"]')).toHaveText('Your Cart');
  });
});

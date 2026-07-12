# learnplaywright
Learn Playwright test automation for Sauce demo website end to end business work flow using csv test data

Sauce Demo Playwright Framework Overview

1. Purpose
This document describes the Playwright framework created for the Sauce Demo website, including page object classes, test data files, and end-to-end workflow tests.

2. Page Classes

InventoryPageSauceDemo
Location: src/pages/inventory.page.ts

Handles inventory item selection and add-to-cart actions.

Key methods:

goto()
verifyInventoryPage()
getProductCard(productName)
getProductTitle(productName)
getProductPrice(productName)
getProductDescription(productName)
getAddToCartButton(productName)
getRemoveButton(productName)
addToCart(productName)
removeFromCart(productName)
getCartCount()
goToCart()

CartPageSauceDemo
Location: src/pages/cart.page.ts

Verifies cart contents and navigates to checkout.

Key methods:
verifyCartPage()
getCartItemNames()
getCartItemPrices()
getCartItemDescriptions()
verifyCartItems(expectedNames)
verifyCartItemPrices(expectedPrices)
verifyCartItemDescriptions(expectedDescriptions)
goToCheckout()

CheckoutPageSauceDemo
Location: src/pages/checkout.page.ts

Fills checkout step one customer information.

Key methods:
verifyCheckoutStepOnePage()
enterFirstName(value)
enterLastName(value)
enterPostalCode(value)
clickContinue()

CheckoutStepTwoPageSauceDemo
Location: src/pages/checkout-step-two.page.ts

Verifies order overview details and finishes checkout.

Key methods:
verifyCheckoutOverviewPage()
getCheckoutItemNames()
getCheckoutItemPrices()
getCheckoutItemDescriptions()
verifyCheckoutItemNames(expectedNames)
verifyCheckoutItemPrices(expectedPrices)
verifyCheckoutItemDescriptions(expectedDescriptions)
clickFinish()

CheckoutCompletePageSauceDemo
Location: src/pages/checkout-complete.page.ts

Verifies checkout completion and navigates back home.

Key methods:
verifyCheckoutCompletePage()
clickBackHome()

3. Test Data Files
The framework uses CSV data files to drive product verification and checkout information:

src/tests/test-data/inventoryData.csv
Contains inventory test data with columns: productName, expectedDescription, expectedPrice.

src/tests/test-data/userData.csv
Contains checkout user data with columns: firstName, lastName, postalCode.

4. Test Specifications
inventory.add-all.spec.ts

End-to-end test that runs the full workflow in a single spec shown below:

inventory add-to-cart
cart verification
checkout info
overview verification
finish and complete checkout

inventory.add-all-multipletest.spec.ts

Split workflow tests covering each stage separately:

inventory add-to-cart
cart verification
checkout info
overview verification
finish and complete checkout

5. Framework Architecture
   
The framework follows a Page Object Model design. Each page class encapsulates locators and actions for a specific Sauce Demo page. Tests drive the workflow by combining these page objects and consuming test data from CSV files.

Architecture diagram:

<img width="1200" height="800" alt="image" src="https://github.com/user-attachments/assets/b302d1ad-c55e-4ed9-bb87-d929df574e11" />



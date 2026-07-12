import { expect, test, devices } from '@playwright/test';

// Feature 1: Multiple isolated contexts with different configurations
test('Multiple user sessions with isolated contexts', async ({ browser }) => {

  const users = [
    { username: 'standard_user', password: 'secret_sauce', role: 'admin' },
    { username: 'problem_user', password: 'secret_sauce', role: 'user' }
  ];

  for (const user of users) {
    const context = await browser.newContext({
      // Custom HTTP headers per context
      extraHTTPHeaders: {
        'User-Role': user.role,
        'X-User-Agent': `Test-${user.username}`
      },
      // Browser properties per context
      locale: 'en-US',
      timezone: 'America/New_York',
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[id="user-name"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('input[id="login-button"]');
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Feature 2: Take screenshot per user context
    await page.screenshot({ path: `test-results/${user.username}-screenshot.png` });
    
    // Feature 3: Check cookies for this specific context
    const cookies = await context.cookies();
    console.log(`${user.username} cookies:`, cookies);
    
    // Feature 4: Store context state for later reuse
    await context.storageState({ path: `test-results/${user.username}-storage.json` });
    
    await context.close();
  }

});

// Feature 5: Parallel execution with multiple contexts
test('Parallel context execution', async ({ browser }) => {
  const users = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' }
  ];

  // Run all contexts in parallel
  await Promise.all(users.map(async (user) => {
    const context = await browser.newContext({
      locale: 'en-US',
      timezone: 'Europe/London'
    });
    
    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[id="user-name"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('input[id="login-button"]');
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await context.close();
  }));
});

// Feature 6: Device emulation per context (mobile testing)
test('Test on different devices', async ({ browser }) => {
  const testDevices = ['iPhone 12', 'Pixel 5', 'iPad Pro'];

  for (const deviceName of testDevices) {
    const context = await browser.newContext({
      ...devices[deviceName],
      locale: 'en-US'
    });

    const page = await context.newPage();
    await page.goto('https://www.saucedemo.com/');
    
    // Check if page is responsive on this device
    const viewport = page.viewportSize();
    console.log(`Testing on ${deviceName}: ${viewport?.width}x${viewport?.height}`);
    
    await context.close();
  }
});

// Feature 7: Geolocation + Permissions
test('Context with geolocation and permissions', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 40.7128, longitude: -74.0060 }, // New York
    permissions: ['geolocation'],
    locale: 'en-US',
    timezone: 'America/New_York'
  });

  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/');
  
  // Context is aware of geolocation
  const geoData = await page.evaluate(() => {
    return navigator.geolocation.getCurrentPosition(
      pos => pos.coords,
      () => null
    );
  }).catch(() => null);

  console.log('Geolocation data:', geoData);
  await context.close();
});

// Feature 8: Network interception and offline mode
test('Context with network control', async ({ browser }) => {
  const context = await browser.newContext({
    offline: false // Can be toggled to true for offline testing
  });

  const page = await context.newPage();

  // Feature 9: Intercept and mock network requests
  await page.route('**/*.json', route => {
    if (route.request().url().includes('inventory')) {
      route.abort(); // Block certain requests
    } else {
      route.continue();
    }
  });

  await page.goto('https://www.saucedemo.com/');
  await page.fill('input[id="user-name"]', 'standard_user');
  await page.fill('input[id="password"]', 'secret_sauce');
  await page.click('input[id="login-button"]');

  await context.close();
});


// Feature 10: Share storage state across contexts (reuse login)
test('Reuse storage state across contexts', async ({ browser }) => {
  // First context: Login
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  
  await page1.goto('https://www.saucedemo.com/');
  await page1.fill('input[id="user-name"]', 'standard_user');
  await page1.fill('input[id="password"]', 'secret_sauce');
  await page1.click('input[id="login-button"]');
  await expect(page1).toHaveURL('https://www.saucedemo.com/inventory.html');

  // Save this session
  const storageState = await context1.storageState();
  await context1.close();

  // Second context: Reuse the saved session
  const context2 = await browser.newContext({
    storageState: storageState
  });
  
  const page2 = await context2.newPage();
  await page2.goto('https://www.saucedemo.com/inventory.html');
  
  // Already logged in!
  await expect(page2).toHaveURL('https://www.saucedemo.com/inventory.html');
  
  await context2.close();
});

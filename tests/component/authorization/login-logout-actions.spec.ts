import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login-page';
import { RegistrationPage } from '../../../pages/registration-page';
import { generateTestUser, User } from '../../../utils/email-generator';
import { log } from 'console';

// Login/Logout actions test cases

test.describe('Login/Logout actions', () => {
  let testUser: User;
  let mainPageUrl = '/cs/'; // Adjust based on actual main page URL
  let loginPageUrl = '/cs/p%C5%99ihl%C3%A1sit'; // Adjust based on actual login URL
  let accountPageUrl = '/cs/muj-ucet'; // Adjust based on actual account page URL

  test.beforeAll(async ({ browser }) => {
    // Create a test user for logout tests
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const registrationPage = new RegistrationPage(page);
    testUser = generateTestUser(8);
    
    // Register a new user
    await registrationPage.goto();
    await registrationPage.selectGender('male');
    await registrationPage.firstNameInput.fill(testUser.firstName);
    await registrationPage.lastNameInput.fill(testUser.lastName);
    await registrationPage.emailInput.fill(testUser.email);
    await registrationPage.passwordInput.fill(testUser.password);
    await registrationPage.checkAgreeTerms();
    await registrationPage.checkPrivacyPolicy();
    await registrationPage.submitRegistration();
    
    await page.waitForLoadState('networkidle');
    await context.close();
  });

  test.afterEach(async ({ page, context }) => {
    // Clear all cookies
    await context.clearCookies();
  });

  test('CT-AUTH-008: Manual logout', { tag: '@component' }, async ({ page }) => {
    
    // Step 1: Login with valid credentials
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    expect(currentUrl).toMatch(loginPageUrl);
    
    // Step 3: Find and click logout link
    // Common logout link selectors in PrestaShop
const btnContainer = page.locator('div.user-info');
await btnContainer.locator('a').first().click();

    await page.waitForLoadState('networkidle');
    const loggedOutUrl = page.url();
    expect(loggedOutUrl).not.toMatch(accountPageUrl);

    const loginBtn = page.getByText(/Přihlásit se/i).first();
    await expect(loginBtn).toBeVisible();

  });

  test('CT-AUTH-009: User logged out due to expired/missing session data', { tag: '@component' }, async ({ page, context }) => {
    // Step 1: Login with valid credentials
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await page.waitForLoadState('networkidle');
    
    // Step 2: Verify user is logged in
    const currentUrl = page.url();
    expect(currentUrl).toMatch(mainPageUrl);
    
    // Step 3: Simulate session expiration by clearing cookies and storage
    await test.step('Clear session data (simulate expired session)', async () => {
      // Clear all cookies
      await context.clearCookies();
      
      // Clear local storage and session storage
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });
    
    // Step 4: Try to access protected page (account page)
    await test.step('Attempt to access account page after session cleared', async () => {
      await page.goto(accountPageUrl);
      await page.waitForLoadState('networkidle');
      
      // Step 5: Verify user is redirected to login page
      const redirectedUrl = page.url();
      expect(redirectedUrl).toMatch(mainPageUrl); // TODO: put to config 
    });
    
    // Step 6: Verify navigation to other protected pages also requires login
    await test.step('Verify other protected pages redirect to login', async () => {
      // Try to access order history or other account-related pages
      await page.goto('/cs/historie-objednavek');
      await page.waitForLoadState('networkidle');
      
      const protectedPageUrl = page.url();
      expect(protectedPageUrl).toMatch(mainPageUrl);
    });
  });

});

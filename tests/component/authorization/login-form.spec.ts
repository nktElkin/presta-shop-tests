import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login-page';
import { RegistrationPage } from '../../../pages/registration-page';
import { generateTestUser, User } from '../../../utils/email-generator';
import { beforeEach } from 'node:test';

// Login form test cases

test.describe('Login form', () => {
  let testUser: User;

  test.beforeAll(async ({ browser }) => {
    // Create a separate context and page for setup
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
    
    // Clean up the context
    await context.close();
  });

  test.afterEach(async ({ page, context }) => {
    // Clear all cookies
    await context.clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.afterAll(async ({ browser }) => {
    console.info('>>> User cleanup <<<');
  });

  test('CT-AUTH-003: Success login with valid credentials', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create a new user for testing (registration first)
    
    
    // Wait for registration to complete
    await page.waitForLoadState('networkidle');
    
    // Step 2: Logout (if logged in after registration)
    // Navigate to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Step 3: Fill login form with valid credentials
    await loginPage.fillEmail(testUser.email);
    await loginPage.fillPassword(testUser.password);
    
    // Step 4: Click login button
    await loginPage.clickLogin();
    
    // Step 5: Verify successful login
    await page.waitForLoadState('networkidle');
    
    // Verify user is redirected to account page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/cs/);
  });

  test('CT-AUTH-004: Failed login - invalid password', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create login page object
    const loginPage = new LoginPage(page);
    
    // Step 2: Navigate to login page
    await loginPage.goto();
    await loginPage.waitForLoad();

    const originalPageUrl = page.url();

    
    // Step 3: Fill login form with valid email but invalid password
    const validEmail = testUser.email;
    const invalidPassword = generateTestUser(8).password;
    
    await loginPage.fillEmail(validEmail);
    await loginPage.fillPassword(invalidPassword);
    
    // Step 4: Click login button
    await loginPage.clickLogin();
    
    // Step 5: Verify error message is displayed
    await page.waitForLoadState('networkidle');
    const passwordInputClasses = await loginPage.getPasswordInputClasses();
    expect(passwordInputClasses).toContain('focus');
    
    const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
  });

  test('CT-AUTH-005: Failed login - invalid login', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create login page object
    const loginPage = new LoginPage(page);
    
    // Step 2: Navigate to login page
    await loginPage.goto();
    await loginPage.waitForLoad();
    const originalPageUrl = page.url();
    
    // Step 3: Fill login form with invalid email
    const invalidEmail = generateTestUser(8).email;
    const password = testUser.password;

    await loginPage.fillEmail(invalidEmail);
    await loginPage.fillPassword(password);
    
    // Step 4: Click login button
    await loginPage.clickLogin();
    
    // Step 5: Verify error message is displayed
    await page.waitForLoadState('networkidle');
    
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    
    // Step 6: Verify error message contains relevant text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
      const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
  });

  test('CT-AUTH-006: Failed login - fields constraint', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create login page object
    const loginPage = new LoginPage(page);
    
    // Step 2: Navigate to login page
    await loginPage.goto();
    await loginPage.waitForLoad();
    
    const originalPageUrl = page.url();
    // Test Case 1: Empty email and password
    await test.step('Empty email and password', async () => {
      await loginPage.clearEmail();
      await loginPage.clearPassword();
      
      // Try to submit with empty fields
      await loginPage.clickLogin();
      
      
        const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
    });
    
    // Test Case 2: Invalid email format
    await test.step('Invalid email format', async () => {
      await loginPage.fillEmail('invalid-email-format');
      await loginPage.fillPassword('SomePassword123!');
      
      await loginPage.clickLogin();
      
      // Browser validation or custom validation should prevent login
        const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
    });
    
    // Test Case 3: Only email filled
    await test.step('Only email filled, password empty', async () => {
      await loginPage.clearEmail();
      await loginPage.clearPassword();
      await loginPage.fillEmail('test@example.com');
      
      await loginPage.clickLogin();
      
        const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
    });
    
    // Test Case 4: Only password filled
    await test.step('Only password filled, email empty', async () => {
      await loginPage.clearEmail();
      await loginPage.clearPassword();
      await loginPage.fillPassword('Password123!');
      
      await loginPage.clickLogin();
      
        const currentPageUrl = page.url();
    expect(currentPageUrl).toMatch(originalPageUrl);
    });
  });

});

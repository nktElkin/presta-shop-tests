import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../../pages/registration-page';
import { generateTestUser, generateUniqueEmail } from '../../../utils/email-generator';

// User registration flow test cases

test.describe('User registration flow', () => {
  
  test('CT-AUTH-001: Successful register as a new user', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create registration page object
    const registrationPage = new RegistrationPage(page);
    
    // Step 2: Generate unique test user data
    const testUser = generateTestUser(8);
    
    // Step 3: Navigate to registration page
    await registrationPage.goto();
    await expect(page).toHaveURL(/\/registrace/);
    
    // Step 4: Fill registration form with valid data
    await registrationPage.selectGender('male');
    await registrationPage.firstNameInput.fill(testUser.firstName);
    await registrationPage.lastNameInput.fill(testUser.lastName);
    await registrationPage.emailInput.fill(testUser.email);
    await registrationPage.passwordInput.fill(testUser.password);
    
    // Step 5: Accept required checkboxes
    await registrationPage.checkAgreeTerms();
    await registrationPage.checkPrivacyPolicy();
    
    // Step 6: Submit registration
    await registrationPage.submitRegistration();
    
    // Step 7: Verify successful registration
    // Wait for redirect or success message
    await page.waitForLoadState('networkidle');
    
    // Verify user is redirected to account page or sees success message
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/cs/);
  });

  test('CT-AUTH-002: Filed registration with already exists credentials', { tag: '@component' }, async ({ page }) => {
    // Step 1: Create registration page object
    const registrationPage = new RegistrationPage(page);
    
    // Step 2: Use existing email from test data
    const existingUser = {
      gender: 'male' as const,
      firstName: 'hataviy',
      lastName: 'fanlvr',
      email: 'hataviy619@fanlvr.com', // Email that already exists
      password: 'Hataviy619@fanlvr.com'
    };
    
    // Step 3: Navigate to registration page
    await registrationPage.goto();
    await expect(page).toHaveURL(/\/registrace/);
    
    // Step 4: Fill registration form with existing credentials
    await registrationPage.selectGender(existingUser.gender);
    await registrationPage.firstNameInput.fill(existingUser.firstName);
    await registrationPage.lastNameInput.fill(existingUser.lastName);
    await registrationPage.emailInput.fill(existingUser.email);
    await registrationPage.passwordInput.fill(existingUser.password);
    
    // Step 5: Accept required checkboxes
    await registrationPage.checkAgreeTerms();
    await registrationPage.checkPrivacyPolicy();
    
    // Step 6: Submit registration
    await registrationPage.submitRegistration();
    
    // Step 7: Verify error message is displayed
    await page.waitForLoadState('networkidle');
    
    // Check if error message is visible
    const isErrorVisible = await registrationPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);
    
    // Verify error message contains relevant text about existing email
    const errorMessage = await registrationPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    // Common error messages for duplicate email in different languages
    expect(errorMessage?.toLowerCase()).toMatch(/tento e-mail je již zaregistrován, zadejte jiný nebo se přihlaste/);
  });

  // Add more registration test cases as defined in test-cases.md

});


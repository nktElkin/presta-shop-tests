import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { RegistrationPage } from '../../pages/registration-page';
import { generateTestUser, User } from '../../utils/email-generator';

test.describe('User buy product using favorites', () => {
  let testUser: User;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const registrationPage = new RegistrationPage(page);
    testUser = generateTestUser(8);
    
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
  
  test('E2E-UF-001: Complete purchase flow from favorites via cart to checkout', { tag: '@e2e' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await page.waitForLoadState('networkidle');

    await page.goto('/cs/');
    await page.waitForLoadState('networkidle');


 await page.getByRole('button', { name: 'favorite_border' }).nth(1).click();
  await page.getByText('My wishlist').click();
  await page.getByText('Produkt přidán').click();
  (await page.locator('a.account')).click();
      await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: 'favorite My wishlists' }).click();
  await page.getByText('My wishlist (1) share').click();
      await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Přidat do košíku' }).click();
      await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: /Pokračovat do pokladny/i }).click();
      await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: /Pokračovat do pokladny/i }).click();
      await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Alias' }).fill('qwe');
  await page.getByRole('textbox', { name: 'Adresa' }).fill('qwe');
  await page.getByRole('textbox', { name: 'Město / Obec' }).fill('qwe');
  await page.getByLabel('Stát (kraj / oblast)').selectOption('4');
  await page.getByRole('textbox', { name: 'PSČ' }).fill('12000');
  await page.getByRole('button', { name: 'Pokračovat' }).click();
  await page.locator('.row.carrier').click();
  await page.getByRole('button', { name: 'Pokračovat' }).click();
  await expect(page.getByText(/Bohužel není k dispozici/i)).toBeVisible();
  

  });

});

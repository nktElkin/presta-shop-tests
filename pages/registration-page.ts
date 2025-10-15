import { Page, Locator } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  
  readonly backToLoginLink: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly showPasswordButton: Locator;
  readonly birthDateInput: Locator;
  readonly receiveOffersCheckbox: Locator;
  readonly agreeTermsCheckbox: Locator;
  readonly newsletterCheckbox: Locator;
  readonly privacyPolicyCheckbox: Locator;
  readonly saveButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.backToLoginLink = this.page.getByRole('button', { name: 'Uložit' })
    this.genderMaleRadio = this.page.getByRole('radio', { name: 'Pan', exact: true });
    this.genderFemaleRadio = this.page.getByRole('radio', { name: 'Paní', exact: true });
    this.firstNameInput = this.page.getByRole('textbox', { name: 'Jméno' });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Příjmení' });
    this.emailInput = this.page.getByRole('textbox', { name: 'E-mail' });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Pole pro heslo' });
    this.showPasswordButton = this.page.locator('button:has-text("UKÁZAT")');
    this.birthDateInput = this.page.getByRole('textbox', { name: 'Datum narození' })
    this.receiveOffersCheckbox = this.page.locator('input[name="optin"]');
    this.agreeTermsCheckbox = this.page.locator('input[name="psgdpr"]');
    this.newsletterCheckbox = this.page.locator('input[name="newsletter"]');
    this.privacyPolicyCheckbox = this.page.locator('input[name="customer_privacy"]');
    this.saveButton = this.page.getByRole('button', { name: 'Uložit' })
    this.errorMessage = this.page.locator('alert, .alert-danger');
    this.successMessage = this.page.locator('.alert-success');
  }

  async goto() {
    await this.page.goto('/cs/registrace');
  }

  async selectGender(gender: 'male' | 'female') {
    if (gender === 'male') {
      await this.genderMaleRadio.check();
    } else {
      await this.genderFemaleRadio.check();
    }
  }

  async fillRegistrationForm(
    gender: 'male' | 'female',
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthDate?: string
  ) {
    await this.selectGender(gender);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    if (birthDate) {
      await this.birthDateInput.fill(birthDate);
    }
  }

  async checkReceiveOffers() {
    await this.receiveOffersCheckbox.check();
  }

  async checkAgreeTerms() {
    await this.agreeTermsCheckbox.check();
  }

  async checkNewsletter() {
    await this.newsletterCheckbox.check();
  }

  async checkPrivacyPolicy() {
    await this.privacyPolicyCheckbox.check();
  }

  async submitRegistration() {
    await this.saveButton.click();
  }

  async register(
    gender: 'male' | 'female',
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    options?: {
      birthDate?: string;
      receiveOffers?: boolean;
      agreeTerms?: boolean;
      newsletter?: boolean;
      privacyPolicy?: boolean;
    }
  ) {
    await this.fillRegistrationForm(gender, firstName, lastName, email, password, options?.birthDate);
    
    if (options?.receiveOffers) {
      await this.checkReceiveOffers();
    }
    
    if (options?.agreeTerms) {
      await this.checkAgreeTerms();
    }
    
    if (options?.newsletter) {
      await this.checkNewsletter();
    }
    
    if (options?.privacyPolicy) {
      await this.checkPrivacyPolicy();
    }
    
    await this.submitRegistration();
  }

  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  async goToLogin() {
    await this.backToLoginLink.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async isSaveButtonEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }
}

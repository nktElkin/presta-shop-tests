import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Locators
    readonly loginFormContainer: Locator;
    readonly loginForm: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly showPasswordButton: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly registerLink: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginFormContainer = page.locator('section.login-form');
        this.loginForm = this.loginFormContainer.locator('form');
        this.emailInput = this.loginForm.locator('input[name="email"]');
        this.passwordInput = this.loginForm.locator('input[name="password"]');
        this.showPasswordButton = this.loginForm.locator('button[data-action="show-password"]');
        this.loginButton = this.loginForm.locator('button[type="submit"]');
        this.errorMessage = page.locator('.alert-danger, [role="alert"]');
        this.registerLink = page.locator('a:has-text("Nemáte účet? Vytvořte si jej zde")');
        this.forgotPasswordLink = page.locator('a:has-text("Zapomněli jste své heslo?")');
    }

    async goto(): Promise<void> {
        await this.page.goto('/cs/přihlásit');
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async getPasswordInputClasses(): Promise<string | null> {
        return await this.passwordInput.getAttribute('class');
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async togglePasswordVisibility(): Promise<void> {
        await this.showPasswordButton.click();
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }

    async clickRegisterLink(): Promise<void> {
        await this.registerLink.click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLogin();
    }

    async clearEmail(): Promise<void> {
        await this.emailInput.clear();
    }

    async clearPassword(): Promise<void> {
        await this.passwordInput.clear();
    }

    async getErrorMessage(): Promise<string | null> {
        if (await this.errorMessage.isVisible()) {
            return await this.errorMessage.textContent();
        }
        return null;
    }

    async isErrorMessageVisible(): Promise<boolean> {
        try {
            return await this.errorMessage.isVisible({ timeout: 3000 });
        } catch {
            return false;
        }
    }

    async isLoginButtonEnabled(): Promise<boolean> {
        return await this.loginButton.isEnabled();
    }

    async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }
}


// {
//   "validUser": {
//     "username": "admin@cs.local",
//     "password": "SuperSecretPass123!"
//   },
//   "invalidUser": {
//     "username": "invalid@test.com",
//     "password": "wrong"
//   }
// }
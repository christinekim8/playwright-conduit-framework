import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly inputEmail: Locator;
    readonly inputPassword: Locator;
    readonly buttonSignIn: Locator;
    readonly errorMessage: Locator; 

    constructor(page: Page) {
        super(page);

        // Selectors for Login Form
        this.inputEmail = page.locator('input[placeholder="Email"]');
        this.inputPassword = page.locator('input[placeholder="Password"]');
        this.buttonSignIn = page.locator('button[type="submit"]');
        
        // Error messages usually appear in a list
        this.errorMessage = page.locator('.error-messages li');
    }

    // Actions
    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, pass: string) {
        await this.inputEmail.fill(email);
        await this.inputPassword.fill(pass);
        await this.buttonSignIn.click();
    }
}
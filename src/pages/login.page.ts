//src/pages/login.page.ts
import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Login Page.
 * Handles user authentication flows and validation of error messages.
 */
export class LoginPage extends BasePage {
    readonly inputEmail: Locator;
    readonly inputPassword: Locator;
    readonly buttonSignIn: Locator;
    readonly errorMessages: Locator; 

    constructor(page: Page) {
        super(page);

        // Locators using Playwright best practices (Placeholder & Role)
        // These are less brittle than CSS selectors and closer to user behavior.
        this.inputEmail = page.getByPlaceholder('Email');
        this.inputPassword = page.getByPlaceholder('Password');
        this.buttonSignIn = page.getByRole('button', { name: 'Sign in' });
        
        // Error messages in Conduit are typically displayed as a list item
        this.errorMessages = page.locator('.error-messages li');
    }

    // --- Actions ---

    /**
     * Navigates directly to the login page.
     */
    async goto() {
        await this.page.goto('/login');
    }

    /**
     * Performs the login action.
     * @param email - User's email address
     * @param password - User's password
     */
    async login(email: string, password: string) {
        await this.inputEmail.fill(email);
        await this.inputPassword.fill(password);
        await this.buttonSignIn.click();
    }

    /**
     * Retrieves all visible error messages as an array of strings.
     * Useful for verifying specific validation failures.
     * @returns Promise<string[]>
     */
    async getErrorMessages(): Promise<string[]> {
        return await this.errorMessages.allInnerTexts();
    }
}
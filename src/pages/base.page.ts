//src/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

/**
 * BasePage Class
 * Provides common locators and shared actions for the Global Navigation Bar (GNB) and Footer.
 * All specific Page Objects should extend this class to reuse shared functionality.
 */
export class BasePage {
    readonly page: Page;

    // Common GNB Elements
    readonly brandLogo: Locator;
    readonly navHome: Locator;
    readonly navSignIn: Locator;
    readonly navSignUp: Locator;
    readonly navNewArticle: Locator;
    readonly navSettings: Locator;
    readonly navUsername: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize GNB locators using getByRole for better accessibility-based testing
        this.brandLogo = page.locator('.navbar-brand');
        this.navHome = page.locator('nav').getByRole('link', { name: 'Home' })
        this.navSignIn = page.getByRole('link', { name: 'Sign in' });
        this.navSignUp = page.getByRole('link', { name: 'Sign up' });
        this.navNewArticle = page.getByRole('link', { name: /New Article/i });
        this.navSettings = page.getByRole('link', { name: 'Settings' });

        /** * Dynamic Username Locator 
         * Locates the profile link by checking for the 'user-pic' sibling or specific navigation pattern.
         */
        this.navUsername = page.locator('ul.nav.navbar-nav li a').filter({
            has: page.locator('i.ion-gear-a, img.user-pic').or(page.locator('text=' + (process.env.USER_NAME || '')))
        }).last();

        // Footer
        this.footer = page.locator('footer');
    }

    // --- Common Actions (Navigation) ---

    async navigateToHome() {
        await this.navHome.click();
    }

    async navigateToSignIn() {
        await this.navSignIn.click();
    }

    async navigateToSignUp() {
        await this.navSignUp.click();
    }

    async navigateToNewArticle() {
        await this.navNewArticle.click();
    }

    async navigateToSettings() {
        await this.navSettings.click();
    }

    async navigateToProfile() {
        await this.navUsername.click();
    }
}
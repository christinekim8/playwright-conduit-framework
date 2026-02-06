//src/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    // Common Elements (Header & Footer)
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
        //initialize GNB locators
        this.brandLogo = page.locator('.navbar-brand');
        this.navHome = page.locator('ul.nav.navbar-nav li a').filter({ hasText: 'Home' });
        this.navSignIn = page.locator('ul.nav.navbar-nav li a').filter({ hasText: 'Sign in' });
        this.navSignUp = page.locator('ul.nav.navbar-nav li a').filter({ hasText: 'Sign up' });
        this.navNewArticle = page.locator('ul.nav.navbar-nav li a').filter({ hasText: 'New Article' });
        this.navSettings = page.locator('ul.nav.navbar-nav li a').filter({ hasText: 'Settings' });

        // Dynamic Username Locator
        const username = process.env.USER_NAME || 'username10';
        this.navUsername = page.locator('ul.nav.navbar-nav li a').filter({ hasText: username });

        // Footer
        this.footer = page.locator('footer');
    }

    // Common Actions (Navigation)
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
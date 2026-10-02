//src/pages/settings.page.ts
import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class SettingsPage extends BasePage {
    readonly inputUrl: Locator;
    readonly inputBio: Locator;
    readonly inputPassword: Locator;
    readonly buttonUpdateSettings: Locator;
    readonly buttonLogout: Locator;

    constructor(page: Page) {
        super(page);

        this.inputUrl = page.getByPlaceholder('URL of profile picture');
        this.inputBio = page.getByPlaceholder('Short bio about you');
        this.inputPassword = page.getByPlaceholder('New Password');
        this.buttonUpdateSettings = page.getByRole('button', { name: 'Update Settings' });
        
        // "Or click here to logout." button
        this.buttonLogout = page.getByRole('button', { name: 'Or click here to logout.' });
    }

    // Actions
    async goto() {
        await this.page.goto('/settings');
    }

    async logout() {
        await this.buttonLogout.click();
    }
}
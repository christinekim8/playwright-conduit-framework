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

        this.inputUrl = page.locator('input[placeholder="URL of profile picture"]');
        this.inputBio = page.locator('textarea[placeholder="Short bio about you"]');
        this.inputPassword = page.locator('input[placeholder="New Password"]');
        this.buttonUpdateSettings = page.locator('button[type="submit"]');
        
        // "Or click here to logout." button
        this.buttonLogout = page.locator('button.btn-outline-danger');
    }

    // Actions
    async goto() {
        await this.page.goto('/settings');
    }

    async logout() {
        await this.buttonLogout.click();
    }
}
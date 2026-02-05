import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class EditorPage extends BasePage {
    readonly inputTitle: Locator;
    readonly inputDescription: Locator;
    readonly inputBody: Locator;
    readonly inputTags: Locator;
    readonly buttonPublish: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.inputTitle = page.locator('input[placeholder="Article Title"]');
        this.inputDescription = page.locator('input[placeholder="What\'s this article about?"]');
        this.inputBody = page.locator('textarea[placeholder="Write your article (in markdown)"]');
        this.inputTags = page.locator('input[placeholder="Enter tags"]');
        this.buttonPublish = page.locator('button[type="submit"]'); 
        this.errorMessage = page.locator('.error-messages li');
    }

    // Actions
    async goto() {
        await this.page.goto('/editor');
    }

    async submitArticle(title: string, desc: string, body: string, tags: string[]) {
        await this.inputTitle.fill(title);
        await this.inputDescription.fill(desc);
        await this.inputBody.fill(body);

        // Tags handling: Type tag and press Enter
        for (const tag of tags) {
            await this.inputTags.fill(tag);
            await this.inputTags.press('Enter');
        }

        await this.buttonPublish.click();
    }
}
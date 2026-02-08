//src/pages/editor.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object Model for the Editor View.
 * Supports both creating new articles and editing existing ones.
 */
export class EditorPage extends BasePage {
    readonly inputTitle: Locator;
    readonly inputDescription: Locator;
    readonly inputBody: Locator;
    readonly inputTags: Locator;
    readonly btnPublish: Locator;

    constructor(page: Page) {
        super(page);

        // Locators using Playwright best practices (Role & Placeholder)
        this.inputTitle = page.getByPlaceholder('Article Title');
        this.inputDescription = page.getByPlaceholder('What\'s this article about?');
        this.inputBody = page.getByPlaceholder('Write your article (in markdown)');
        this.inputTags = page.getByPlaceholder('Enter tags');
        this.btnPublish = page.getByRole('button', { name: 'Publish Article' });
    }

    /**
     * Navigates to the editor page.
     * @param slug - Optional article slug for Edit Mode.
     */
    async goto(slug?: string) {
        if (slug) {
            await this.page.goto(`/editor/${slug}`);
        } else {
            await this.page.goto('/editor');
        }
    }

    /**
     * Fills the article form and submits it. 
     * Uses object parameter for better readability and consistency with ApiHelper.
     * @param data - Object containing title, description, body, and tags.
     */
    async submitArticle(data: { title: string, description: string, body: string, tags?: string[] }) {
        // 1. Fill Text Fields
        await this.inputTitle.fill(data.title);
        await this.inputDescription.fill(data.description);
        await this.inputBody.fill(data.body);

        // 2. Handle Tags (Conduit requires 'Enter' key to register tags)
        if (data.tags && data.tags.length > 0) {
            for (const tag of data.tags) {
                await this.inputTags.fill(tag);
                await this.inputTags.press('Enter');
            }
        }

        // 3. Submit Form
        await this.btnPublish.click();
    }
}
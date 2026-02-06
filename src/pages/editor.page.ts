//src/pages/editor.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class EditorPage extends BasePage {
    readonly inputTitle: Locator;
    readonly inputDescription: Locator;
    readonly inputBody: Locator;
    readonly inputTags: Locator;
    readonly btnPublish: Locator;

    constructor(page: Page) {
        super(page);

        this.inputTitle = page.getByPlaceholder('Article Title');
        this.inputDescription = page.getByPlaceholder('What\'s this article about?');
        this.inputBody = page.getByPlaceholder('Write your article (in markdown)');
        this.inputTags = page.getByPlaceholder('Enter tags');
        this.btnPublish = page.getByRole('button', { name: 'Publish Article' });
    }

    async goto(slug?: string) {
        if (slug) {
            // Edit Mode: e.g., /editor/Trucido-arx-vulgo.-46041
            await this.page.goto(`/editor/${slug}`);
        } else {
            // Create Mode: /editor
            await this.page.goto('/editor');
        }
    }

    /*
    * Populates the article form and submits it.
    * @param title - The title of the article
    * @param description - A short summary/description
    * @param body - The main content of the article (Markdown supported)
    * @param tags - An array of tags to categorize the article (e.g., ['test', 'automation'])
    */
    async createArticle(title: string, description: string, body: string, tags: string[]) {

        // 1. Fill Text Fields
        await this.inputTitle.fill(title);
        await this.inputDescription.fill(description);
        await this.inputBody.fill(body);

        // 2. Handle Tags
        // Note: The Conduit app requires an 'Enter' key press after each tag to register it.
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                await this.inputTags.fill(tag);
                await this.inputTags.press('Enter');
            }
        }

        // 3. Submit Form
        await this.btnPublish.click();
    }
}
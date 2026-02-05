import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    // Banner Elements
    readonly banner: Locator;
    readonly bannerTitle: Locator;
    readonly bannerText: Locator;

    // Feed Tabs
    readonly tabYourFeed: Locator;
    readonly tabGlobalFeed: Locator;
    readonly activeTab: Locator;

    readonly firstArticlePreview: Locator;
    readonly firstArticleTitle: Locator;

    readonly popularTagsSection: Locator;

    constructor(page: Page) {
        super(page);

        this.banner = page.locator('.banner');
        this.bannerTitle = page.locator('.logo-font');
        this.bannerText = page.locator('.banner p');

        this.tabYourFeed = page.locator('.nav-link').filter({ hasText: 'Your Feed' });
        this.tabGlobalFeed = page.locator('.nav-link').filter({ hasText: 'Global Feed' });
        this.activeTab = page.locator('.feed-toggle .nav-link.active');

        this.firstArticlePreview = page.locator('.article-preview').first();
        this.firstArticleTitle = this.firstArticlePreview.locator('h1');

        this.popularTagsSection = page.locator('.sidebar');
    }

    // Actions
    async goto() {
        await this.page.goto('/');
    }

    async clickGlobalFeed() {
        await this.tabGlobalFeed.click();
    }

    async clickYourFeed() {
        await this.tabYourFeed.click();
    }
}
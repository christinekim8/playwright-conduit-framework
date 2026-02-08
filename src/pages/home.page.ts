//src/pages/home.page.ts
import { BasePage } from './base.page';
import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Home Page.
 * Manages the global feed, personal feed, tag filtering, and complex pagination logic.
 */
export class HomePage extends BasePage {
    // 1. Banner Elements
    readonly banner: Locator;
    readonly bannerTitle: Locator;
    readonly bannerText: Locator;

    // 2. Feed Tabs & Content
    readonly tabYourFeed: Locator;
    readonly tabGlobalFeed: Locator;
    readonly activeTab: Locator;
    readonly articleListContainer: Locator;
    readonly articlePreviews: Locator;
    readonly loadingIndicator: Locator;
    readonly emptyStateMessage: Locator;

    // 3. Popular Tags Section
    readonly sidebarSection: Locator;
    readonly tagList: Locator;

    // 4. Pagination Elements
    readonly paginationLinks: Locator;
    readonly activePaginationItem: Locator;

    constructor(page: Page) {
        super(page);

        // Banner Locators
        this.banner = page.locator('.banner');
        this.bannerTitle = page.locator('.logo-font');
        this.bannerText = page.locator('.banner p');

        // Feed Selection Locators
        this.tabYourFeed = page.locator('.nav-link').filter({ hasText: 'Your Feed' });
        this.tabGlobalFeed = page.locator('.nav-link').filter({ hasText: 'Global Feed' });
        this.activeTab = page.locator('.nav-pills .nav-link.active');

        // Content & State Locators
        this.articlePreviews = page.locator('.article-preview');
        this.loadingIndicator = page.locator('text=Loading articles...');
        this.emptyStateMessage = page.locator('text=No articles are here... yet.');
        this.articleListContainer = page.locator('app-article-list');

        // Sidebar & Tag Locators
        this.sidebarSection = page.locator('.sidebar');
        this.tagList = page.locator('.tag-list a.tag-default');

        // Pagination Locators
        this.paginationLinks = page.locator('.pagination .page-link');
        this.activePaginationItem = page.locator('.pagination .page-item.active');
    }

    // --- Actions ---

    /**
     * Navigates to the Home page and waits for the initial load.
     */
    async goto() {
        await this.page.goto('/');
        await this.waitForLoading();
    }

    /**
     * Ensures the "Loading..." state is cleared before proceeding.
     * Crucial for preventing race conditions in dynamic feeds.
     */
    async waitForLoading() {
        await expect(this.loadingIndicator).not.toBeVisible();
    }

    /**
     * Filters the feed by clicking a specific tag in the sidebar.
     * @param tagName - The name of the tag to filter by.
     */
    async clickTag(tagName: string) {
        // Encapsulating tag selection and the subsequent loading wait
        await this.tagList.filter({ hasText: tagName }).click();
        await this.waitForLoading();
    }

    /**
     * Navigates to a specific page number.
     * @param pageNumber - The target page number (string or number).
     */
    async clickPage(pageNumber: string | number) {
        const pageBtn = this.paginationLinks.getByText(pageNumber.toString(), { exact: true });
        await pageBtn.scrollIntoViewIfNeeded();
        await pageBtn.click();
        await this.waitForLoading();
    }

    /**
     * Switches to the Global Feed tab.
     */
    async clickGlobalFeed() {
        await this.tabGlobalFeed.click();
        await this.waitForLoading();
    }

    /**
     * Switches to the Your Feed tab.
     */
    async clickYourFeed() {
        await this.tabYourFeed.click();
        await this.waitForLoading();
    }

    /**
     * Automatically calculates and navigates to the next page relative to the current active page.
     */
    async goToNextPage() {
        const currentActivePage = await this.activePaginationItem.innerText();
        const nextPage = parseInt(currentActivePage) + 1;
        await this.clickPage(nextPage);
    }

    /**
     * Returns a locator for an article preview containing specific text.
     */
    getArticleLocator(text: string) {
        return this.articlePreviews.filter({ hasText: text });
    }

    /**
 * Searches for a specific article across multiple pages in the pagination.
 * @param targetTitle - The title of the article to search for.
 * @param maxPages - The maximum number of pages to search through.
 * @returns A boolean indicating whether the article was found.
 */
    async searchArticleInPagination(targetTitle: string, maxPages: number = 5): Promise<boolean> {
        let isArticleFound = false;
        let currentPage = 1;
        const targetArticle = this.getArticleLocator(targetTitle);

        while (!isArticleFound && currentPage <= maxPages) {
            console.log(`🔎 (POM) Searching on Page ${currentPage}...`);
            await this.waitForLoading();

            if (await targetArticle.count() > 0) {
                isArticleFound = true;
                console.log(`✅ (POM) Found article: "${targetTitle}" on Page ${currentPage}`);
                return true;
            }

            if (currentPage < maxPages) {
                currentPage++;
                await this.clickPage(currentPage);
                // Ensure the pagination UI updates correctly
                await expect(this.activePaginationItem).toHaveClass(/active/);
            } else {
                break;
            }
        }
        return false;
    }

    /**
     * Validates that all displayed articles contain a specific tag.
     * If no articles are present, verifies the appropriate empty state message is shown.
     * @param tag - The tag that should be present in all article previews.
     */
    async verifyArticlesHaveTag(tag: string) {
        const articleCount = await this.articlePreviews.count();

        if (articleCount > 0) {
            const articleList = await this.articlePreviews.all();
            for (const article of articleList) {
                // Locates the tag list within each article preview card
                const tagsInArticle = article.locator('.tag-list');
                await expect(tagsInArticle).toContainText(tag);
            }
            console.log(`✅ Verified ${articleCount} articles for tag [${tag}]`);
        } else {
            // Validates the UI state when a tag has no associated articles
            await expect(this.page.locator('text=No articles are here... yet.')).toBeVisible();
            console.log(`ℹ️ No articles found for tag [${tag}], verified empty state message.`);
        }
    }
}
//tests/home.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';
import { ApiHelper } from '@helpers/ApiHelper';

/**
 * Module: Home Page (UI, Navigation & Advanced Dynamic Logic)
 * * * Test Scenarios:
 * - [HOME-01]: Guest View - Verifies layout for unauthenticated users.
 * - [HOME-02]: User View - Verifies personalized layout for authenticated users.
 * - [HOME-03]: Pagination Logic - Searches for an article via API Seeding.
 * - [HOME-04]: Tag Filtering - Dynamically validates filtered content across the list.
 */

test.describe('Module: Home Page (Guest View)', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('HOME-01: Verify Guest UI Layout', async ({ homePage }) => {
        await homePage.goto();
        await expect(homePage.brandLogo).toHaveText('conduit');
        await expect(homePage.navHome).toBeVisible();
        await expect(homePage.navSignIn).toBeVisible();
        await expect(homePage.navSignUp).toBeVisible();

        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);
        await expect(homePage.tabYourFeed).toBeVisible();

        await homePage.waitForLoading();
        await expect(homePage.sidebarSection).toContainText('Popular Tags');
    });
});

test.describe('Module: Home Page (Pagination & Search)', () => {
    let apiHelper: ApiHelper;
    let token: string;
    let targetArticleTitle: string;
    let seededSlugs: string[] = [];

    test.beforeAll(async ({ request }) => {
        apiHelper = new ApiHelper(request);
        token = await apiHelper.login();

        // 1. Define the unique title for search validation
        targetArticleTitle = `Portfolio Search Target - ${faker.string.uuid()}`;

        // 2. ✅ Clean & Efficient: Seed 11 articles using the new helper method
        seededSlugs = await apiHelper.seedArticles(token, 11, targetArticleTitle, ['test', 'pagination']);
    });

    test('HOME-03: Verify dynamic pagination by searching for a specific article', async ({ homePage }) => {
        await homePage.goto();
        await homePage.clickTag('pagination');

        await test.step('Search for the unique article across pages', async () => {
            const found = await homePage.searchArticleInPagination(targetArticleTitle, 5);

            // Optional: verify the result of the search action itself
            expect(found, `Article "${targetArticleTitle}" should be found within 5 pages`).toBeTruthy();
        });

        await test.step('Verify that the target article is visible on the UI', async () => {
            const targetArticle = homePage.getArticleLocator(targetArticleTitle);
            await expect(targetArticle).toBeVisible({ timeout: 5000 });
        });
    });

    test.afterAll(async ({request}) => {
        if (seededSlugs.length > 0) {
            const cleanupHelper = new ApiHelper(request);
            await cleanupHelper.cleanupArticles(token, seededSlugs);
        }
    });
});

test.describe('Module: Home Page (Logged-in View)', () => {
    test('HOME-02: Verify User UI Layout (Personalized)', async ({ homePage }) => {
        await homePage.goto();
        await expect(homePage.navSignIn).not.toBeVisible();
        await expect(homePage.navNewArticle).toBeVisible();
        await expect(homePage.navSettings).toBeVisible();
        await expect(homePage.navUsername).toBeVisible();

        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);
        await expect(homePage.tabYourFeed).toBeVisible();
    });
});

test.describe('Module: Home Page (Tag Filtering)', () => {
    test('HOME-04: Verify Tag Filtering with Comprehensive Validation', async ({ homePage, page }) => {
        await homePage.goto();
        const availableTags = await homePage.tagList.allInnerTexts();
        const tagsToTest = availableTags.slice(0, 3);

        console.log(`🚀 Testing top tags: ${tagsToTest.join(', ')}`);

        for (const tag of tagsToTest) {
            await test.step(`Validate Tag: "${tag}"`, async () => {
                // 1. Click the tag from the sidebar
                await homePage.clickTag(tag);

                // 2. Ensure the active tab reflects the selected tag
                await expect(homePage.activeTab).toContainText(tag);

                // 3. ✅ Refactored: Call the verification logic from POM
                await homePage.verifyArticlesHaveTag(tag);

                // 4. Reset to Global Feed for the next iteration
                await homePage.clickGlobalFeed();
            });
        }
    });
});
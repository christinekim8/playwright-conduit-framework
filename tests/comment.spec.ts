//tests/comment.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';
import { ApiHelper } from '@helpers/ApiHelper';

/**
 * Module: Comment Management
 * * Test Scenarios:
 * - [COM-01]: Post Comment - Verifies immediate UI update after posting.
 * - [COM-02]: Delete Comment - Verifies precise targeting and removal of a specific comment.
 * * Technical Highlights:
 * - API Seeding & Teardown: Using ApiHelper for clean environment setup and automated cleanup.
 * - POM Encapsulation: Abstracting comment interactions (post/delete) into reusable Page Object methods.
 * - Locator Chaining: Leveraging .filter({ hasText: ... }) within POM to target dynamic elements.
 * - Real-time UI Sync: Validating 'Optimistic UI' updates without page refreshes.
 */

test.describe('Module: Comment Management', () => {
    let token: string;
    let articleSlug: string;
    let apiHelper: ApiHelper;

    // 🏗️ Step 0: Precondition - Create an article via API to post comments on
    test.beforeAll(async ({ request }) => {
        apiHelper = new ApiHelper(request);

        // 1. Login & Get Token
        token = await apiHelper.login();

        // 2. Create an article using the Object signature
        articleSlug = await apiHelper.createArticle(token, {
            title: `Comment Test Article ${faker.string.nanoid(5)}`,
            description: 'Testing comments',
            body: 'Article body content',
            tags: ['test']
        });
    });

    test('COM-01 & COM-02: Comment Full Lifecycle (Post & Delete)', async ({ page, articlePage }) => {
        const commentText = `Awesome insight! - ${faker.string.numeric(5)}`;

        const targetComment = articlePage.getCommentLocator(commentText);

        // 🏗️ Step 1: Navigate to the article detail page
        await page.goto(`/article/${articleSlug}`);

        // 🏃 Step 2: Post a new comment [COM-01]
        await test.step('Post a new comment', async () => {
            // ✅ Refined: Using POM method instead of direct locators
            await articlePage.addComment(commentText);

            // 👀 Verify: Comment appears in the list using POM locator
            await expect(targetComment).toBeVisible();
        });

        // 🏃 Step 3: Delete the specific comment [COM-02]
        await test.step('Delete the specific comment', async () => {
            // ✅ Refined: Encapsulated delete logic within ArticlePage POM
            await articlePage.deleteComment(commentText);

            // 👀 Verify: Comment is removed from the UI
            await expect(targetComment).not.toBeVisible();
        });
    });

    // 🧹 Cleanup: Delete the article after the test
    test.afterAll(async ({ request }) => {
        if (articleSlug) {
            const apiHelper = new ApiHelper(request); // fresh request fixture 사용
            await apiHelper.deleteArticle(token, articleSlug);
            console.log(`🧹 Cleanup done: ${articleSlug}`);
        }
    });
});
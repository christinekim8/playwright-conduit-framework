//tests/comment.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';
import { API_URL } from '../playwright.config';

/**
 * Module: Comment Management
 * * Test Scenarios:
 * - [COM-01]: Post Comment - Verifies immediate UI update after posting.
 * - [COM-02]: Delete Comment - Verifies precise targeting and removal of a specific comment.
 * * Technical Highlights:
 * - API Seeding: Creating a dedicated article via API to ensure a clean testing environment.
 * - Locator Chaining: Using .filter({ hasText: ... }) to target specific elements within a list.
 * - Real-time UI Sync: Validating 'Optimistic UI' updates without page refreshes.
 */

test.describe('Module: Comment Management', () => {
    let token: string;
    let articleSlug: string;

    // 🏗️ Step 0: Precondition - Create an article via API to post comments on
    test.beforeAll(async ({ request }) => {
        const loginResponse = await request.post(`${API_URL}/users/login`, {
            data: {
                user: {
                    email: process.env.USER_EMAIL,
                    password: process.env.USER_PASSWORD
                }
            }
        });
        const loginBody = await loginResponse.json();
        token = loginBody.user.token;

        // Create an article
        const articleResponse = await request.post(`${API_URL}/articles`, {
            headers: { 'Authorization': `Token ${token}` },
            data: {
                article: {
                    title: `Comment Test Article ${faker.string.nanoid(5)}`,
                    description: 'Testing comments',
                    body: 'Article body content',
                    tagList: ['test']
                }
            }
        });
        const articleBody = await articleResponse.json();
        articleSlug = articleBody.article.slug;
    });

    test('COM-01 & COM-02: Comment Full Lifecycle (Post & Delete)', async ({ page, articlePage }) => {
        const commentText = `Awesome insight! - ${faker.string.numeric(5)}`;

        // 🏗️ Step 1: Navigate to the article detail page
        await page.goto(`/article/${articleSlug}`);

        // 🏃 Step 2: Post a new comment [COM-01]
        await test.step('Post a new comment', async () => {
            await page.getByPlaceholder('Write a comment...').fill(commentText);

            await articlePage.page.locator('button:has-text("Post Comment")').click();

            // 👀 Verify: Comment appears in the list
            const newComment = page.locator('app-article-comment').filter({ hasText: commentText });
            await expect(newComment).toBeVisible();
        });

        // 🏃 Step 3: Delete the specific comment [COM-02]
        await test.step('Delete the specific comment', async () => {
            // 💡 Skill Highlight: Locator Chaining & Filtering
            const targetCommentCard = page.locator('app-article-comment').filter({ hasText: commentText });

            // Find the trash icon WITHIN that specific card and click it
            const deleteBtn = targetCommentCard.locator('.mod-options .ion-trash-a');
            await deleteBtn.click();

            // 👀 Verify: Comment is removed from the UI
            await expect(targetCommentCard).not.toBeVisible();
        });
    });

    // 🧹 Cleanup: Delete the article after the test
    test.afterAll(async ({ request }) => {
        if (articleSlug) {
            await request.delete(`${API_URL}/articles/${articleSlug}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            console.log(`🧹 Cleaned up article: ${articleSlug}`);
        }
    });
});


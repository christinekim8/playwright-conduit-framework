// tests/editor.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';

test.describe('Module: Editor (New Article)', () => {

    test('EDT-02: Create Article & Verify (Detail + Global Feed)', async ({ editorPage, articlePage, homePage }) => {

        // -----------------------------------------------------------------------
        // Step 0: Test Data Preparation
        // -----------------------------------------------------------------------
        const articleData = {
            title: faker.lorem.sentence(3),
            description: faker.lorem.sentences(2),
            body: faker.lorem.paragraphs(2),
            tags: ['playwright', 'automation', 'blog']
        };

        console.log(`📝 Starting Test for: "${articleData.title}"`);

        // -----------------------------------------------------------------------
        // Step 1: Create Article Action
        // -----------------------------------------------------------------------
        await test.step('1. Create New Article', async () => {
            await editorPage.goto();
            await editorPage.createArticle(
                articleData.title,
                articleData.description,
                articleData.body,
                articleData.tags
            );
        });

        // -----------------------------------------------------------------------
        // Step 2: Verify Detail Page
        // -----------------------------------------------------------------------
        await test.step('2. Verify Article Detail Page', async () => {
            // URL Validation
            const slug = articleData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            await expect(articlePage.page).toHaveURL(new RegExp(slug, 'i'));

            // UI Element Validation
            await expect(articlePage.articleTitle).toHaveText(articleData.title);
            await expect(articlePage.articleBody).toContainText(articleData.body.substring(0, 20));
            await expect(articlePage.editButton).toBeVisible();
            await expect(articlePage.deleteButton).toBeVisible();
            
            // Comment Section Validation
            await expect(articlePage.commentForm).toBeVisible();
        });

        // -----------------------------------------------------------------------
        // Step 3: Verify Global Feed
        // -----------------------------------------------------------------------
        await test.step('3. Verify Global Feed Entry', async () => {
            console.log('🌍 Verifying Global Feed...');
            
            await homePage.goto();
            await homePage.tabGlobalFeed.click();
            await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

            // Verify the newly created article is at the top
            await expect(homePage.firstArticleTitle).toHaveText(articleData.title);
        });
    });
});
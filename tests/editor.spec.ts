//tests/editor.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';

/**
 * Module: Editor (Article Management)
 * * This test suite demonstrates two different automation strategies:
 * * 1. Pure UI Testing: Full end-to-end flow for creating an article.
 * - [EDT-02]: Create Article & Verify (Detail + Global Feed)
 * * 2. Hybrid Testing (API + UI): 
 * - [EDT-12]: Edit Article (Update Body & Description)
 * * Technical Highlights:
 * - Setup: API seeding for fast data preparation.
 * - Action/Verify: UI interaction for core business logic validation.
 * - Teardown: API cleanup to ensure perfect test isolation.
 */
test.describe('Module: Editor (Create Article)', () => {

    test('EDT-02: Create Article & Verify (Detail + Global Feed)', async ({ editorPage, articlePage, homePage }) => {

        // 🏗️ Step 0: Article Data Preparation
        const articleData = {
            title: faker.lorem.sentence(3),
            description: faker.lorem.sentences(2),
            body: faker.lorem.paragraphs(2),
            tags: ['playwright', 'automation', 'blog']
        };

        console.log(`📝 Starting Test for: "${articleData.title}"`);

        // 🏃 Step 1: Create a new article via UI
        await test.step('1. Create New Article', async () => {
            await editorPage.goto();
            await editorPage.createArticle(
                articleData.title,
                articleData.description,
                articleData.body,
                articleData.tags
            );
        });

        // 👀 Step 2: Verify the article detail page
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

        // 👀 Step 3: Verify the article entry on the Global Feed
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

// Strategy: Hybrid Testing (API for Setup/Teardown, UI for Validation)
test.describe('Module: Editor (Update Article - Hybrid Strategy)', () => {
    let token: string;
    let slug: string;

    // Define the API endpoint explicitly
    const API_URL = 'https://conduit-api.bondaracademy.com/api';

    // 🏗️ Step 1: Authenticate via API (get auth token) - runs once before all tests in this block
    test.beforeAll(async ({ request }) => {

        console.log(`🔑 Logging in as: ${process.env.USER_EMAIL}`);

        const response = await request.post(`${API_URL}/users/login`, {
            data: {
                user: {
                    email: process.env.USER_EMAIL,
                    password: process.env.USER_PASSWORD
                }
            }
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`🚨 API Login Failed! Status: ${response.status()} \nBody: ${body}`);
        }

        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();
        token = responseBody.user.token;
    });

    // 🏗️ Step 2: Seed test data via API for test isolation
    test.beforeEach(async ({ request }) => {
        const articleData = {
            article: {
                title: `API Seeded ${faker.string.uuid()}`,
                description: 'This article was created via API',
                body: 'Initial body content',
                tagList: ['api-test']
            }
        };

        const response = await request.post(`${API_URL}/articles`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            data: articleData
        });

        const responseBody = await response.json();
        slug = responseBody.article.slug;
        console.log(`🌱 Created Article via API: ${slug}`);
    });

    // 🏃 Step 3: Edit the seeded article via UI
    test('EDT-12: Edit Article (API Created) - Update Body & Description', async ({ editorPage, articlePage, homePage }) => {

        const updatedBody = `Updated Body Content via UI - ${faker.string.numeric(5)}`;
        const updatedDescription = `Updated Desc via UI - ${faker.string.numeric(5)}`;

        await editorPage.goto(slug);

        await test.step('Update Content', async () => {
            await expect(editorPage.inputTitle).not.toBeEmpty();

            await editorPage.inputDescription.fill(updatedDescription);
            await editorPage.inputBody.fill(updatedBody);
            await editorPage.btnPublish.click();
        });

        // 👀 Step 4: Verify the updated content on the Detail Page
        await test.step('Verify Detail Page', async () => {
            await expect(articlePage.articleBody).toContainText(updatedBody);
        });

        // 👀 Step 5: Verify the update on the Global Feed
        await test.step('Verify Global Feed', async () => {
            await homePage.goto();
            await homePage.tabGlobalFeed.click();
            await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

            const articleLocator = homePage.page.locator('.article-preview').filter({ hasText: updatedDescription });
            await expect(articleLocator).toBeVisible();
        });
    });

    // 🧹 Step 6: Cleanup test data via API after the test
    test.afterEach(async ({ request }) => {
        if (slug) {
            const response = await request.delete(`${API_URL}/articles/${slug}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log(`🧹 API Cleaned Up Article: ${slug} (Status: ${response.status()})`);
        }
    });
});
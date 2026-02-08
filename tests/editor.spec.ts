//tests/editor.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';
import { ApiHelper } from '@helpers/ApiHelper';

/**
 * Module: Editor (Article Management)
 * * * Test Scenarios:
 * - [EDT-02]: Create Article & Verify - Full E2E flow from creation to feed. 
 * - [EDT-12]: Edit Article (Hybrid) - Efficient update using API Seeding. 
 * * * Technical Highlights:
 * - Hybrid Strategy: Using ApiHelper for fast setup (Seeding) and teardown (Cleanup).
 * - Component Interaction: Multi-page flow (Editor -> Article -> Home).
 * - Page Object Model: Leveraging abstracted methods for navigation and filtering.
 * - Data Management: Leveraging @faker-js for dynamic and unique content.
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

            await editorPage.submitArticle(articleData);
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

            // ✅ Refined: Using POM clickTag instead of manual locator
            await homePage.clickTag('playwright');

            const targetArticle = homePage.getArticleLocator(articleData.title);
            await expect(targetArticle).toBeVisible();

            console.log(`✅ Successfully found the article: "${articleData.title}"`);
        });
    });
});

// Strategy: Hybrid Testing (API for Setup/Teardown, UI for Validation)
test.describe('Module: Editor (Update Article - Hybrid Strategy)', () => {
    let apiHelper: ApiHelper;
    let token: string;
    let slug: string;

    // 🏗️ Step 1: Authenticate via API
    test.beforeAll(async ({ request }) => {
        apiHelper = new ApiHelper(request);
        console.log(`🔑 Logging in as: ${process.env.USER_EMAIL}`);
        token = await apiHelper.login();
        console.log(`✅ Logged in successfully. Token secured.`);
    });

    // 🏗️ Step 2: Seed test data via API for test isolation
    test.beforeEach(async ({ request }) => {
        apiHelper = new ApiHelper(request);

        slug = await apiHelper.createArticle(token, {
            title: `API Seeded ${faker.string.uuid()}`,
            description: 'This article was created via API',
            body: 'Initial body content',
            tags: ['api-test']
        });

        console.log(`🌱 Created Article via API: ${slug}`);
    });

    // 🏃 Step 3: Edit the seeded article via UI
    test('EDT-12: Edit Article (API Created) - Update Body & Description', async ({ page, editorPage, articlePage, homePage }) => {

        const updatedBody = `Updated Body Content via UI - ${faker.string.numeric(5)}`;
        const updatedDescription = `Updated Desc via UI - ${faker.string.numeric(5)}`;

        await editorPage.goto(slug);

        await test.step('Update Content', async () => {
            await expect(editorPage.inputTitle).not.toBeEmpty();

            await editorPage.inputDescription.fill(updatedDescription);
            await editorPage.inputBody.fill(updatedBody);
            await editorPage.btnPublish.click();

            // Verification: Ensure navigation to the article detail page is complete
            await expect(page).toHaveURL(new RegExp(`/article/`));
        });

        // 👀 Step 4: Verify the updated content on the Detail Page
        await test.step('Verify Detail Page', async () => {
            await expect(articlePage.articleBody).toContainText(updatedBody);
        });

        // 👀 Step 5: Verify the update on the Global Feed
        await test.step('Verify Global Feed', async () => {
            await homePage.goto();

            // ✅ Refined: Using POM clickTag for data isolation
            await homePage.clickTag('api-test');

            const articleLocator = homePage.getArticleLocator(updatedDescription);
            await expect(articleLocator).toBeVisible();
        });
    });

    // 🧹 Step 6: Cleanup test data via API after the test
    test.afterEach(async ({ request }) => {
        if (slug) {
            const cleanupHelper = new ApiHelper(request);
            const status = await cleanupHelper.deleteArticle(token, slug);
            console.log(`🧹 API Cleaned Up Article: ${slug} (Status: ${status})`);
        }
    });
});
//tests/home.spec.ts
import { test, expect } from '@fixtures/pom';
import { faker } from '@faker-js/faker';

/**
 * Module: Home Page (UI, Navigation & Dynamic Logic)
 * * Description: 
 * This suite verifies the core functionality of the Home Page, ranging from basic UI layout to complex dynamic behaviors like pagination and intelligent searching.
 * * Test Scenarios:
 * - [HOME-01]: Guest View - Verifies layout for unauthenticated users.
 * - [HOME-04]: User View - Verifies personalized layout for authenticated users.
 * - [HOME-03]: Pagination Logic - Searches for a specific article across multiple pages.
 * * Technical Highlights:
 * - State Management: Context overriding for Guest/User state isolation.
 * - API Seeding: Automating preconditions by injecting large datasets via REST API.
 * - Intelligent Search: Implementing a while-loop for dynamic pagination traversal.
 * - Resilience: Handling race conditions (Loading states) and UI sync.
 */

// ---------------------------------------------------------------------------
// Group 1: Guest User Experience
// ---------------------------------------------------------------------------
test.describe('Module: Home Page (Guest View)', () => {
    // Ensure clean state (Guest mode) by overriding storageState for this group
    test.use({ storageState: { cookies: [], origins: [] } });

    test('HOME-01: Verify Guest UI Layout', async ({ homePage }) => {

        // 🏗️ Step 1: Navigate to the Home page as a Guest user
        await homePage.goto();

        // 👀 Step 2: Perform initial layout and branding check
        await expect(homePage.brandLogo).toHaveText('conduit');
        await expect(homePage.navHome).toBeVisible();

        // 👀 Step 3: Verify visibility of Guest-specific navigation elements
        await expect(homePage.navSignIn).toBeVisible();
        await expect(homePage.navSignUp).toBeVisible();

        // 👀 Step 4: Verify default Feed tab states for Guests
        // Expect 'Global Feed' to be active by default for guests.
        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

        // 'Your Feed' acts as a gatekeeper for guests (visible but redirects to login).
        // Redirection logic is covered in AUTH-15.
        await expect(homePage.tabYourFeed).toBeVisible();

        // 👀 Step 5: Verify Popular Tags Section
        await expect(homePage.popularTagsSection).toContainText('Popular Tags');
    });
});

// ---------------------------------------------------------------------------
// Group 2: Authenticated User Experience
// ---------------------------------------------------------------------------
test.describe('Module: Home Page (Logged-in View)', () => {

    // Uses global authenticated state injected via global-setup
    test('HOME-04: Verify User UI Layout (Personalized)', async ({ homePage }) => {

        // 🏗️ Step 1: Navigate to the Home page as an Authenticated user
        await homePage.goto();

        // 👀 Step 2: Perform initial layout and branding check
        await expect(homePage.brandLogo).toHaveText('conduit');
        await expect(homePage.navHome).toBeVisible();

        // 👀 Step 3: Verify visibility of User-specific personalized menus
        await expect(homePage.navSignIn).not.toBeVisible();
        await expect(homePage.navSignUp).not.toBeVisible();
        await expect(homePage.navNewArticle).toBeVisible();
        await expect(homePage.navSettings).toBeVisible();
        await expect(homePage.navUsername).toBeVisible();

        // 👀 Step 4: Verify Feed tab availability and default active state
        // Even for logged-in users, the application defaults to 'Global Feed'.
        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

        // 'Your Feed' is available but inactive.
        await expect(homePage.tabYourFeed).toBeVisible();
    });
});

// ---------------------------------------------------------------------------
// Group 3: Pagination & Dynamic Search
// ---------------------------------------------------------------------------
test.describe('Module: Home Page (Pagination & Search)', () => {
    
    let targetArticleTitle: string;
    const API_URL = 'https://conduit-api.bondaracademy.com/api';

    // 🏗️ Step 1: API Seeding - Create a large dataset to ensure pagination exists
    // 💡 Skill Highlight: Using API to control test preconditions for stable results.
    test.beforeAll(async ({ request }) => {
        // 1. Authenticate via API to get the token
        const loginResponse = await request.post(`${API_URL}/users/login`, {
            data: { 
                user: { 
                    email: process.env.USER_EMAIL, 
                    password: process.env.USER_PASSWORD 
                } 
            }
        });
        const loginBody = await loginResponse.json();
        const token = loginBody.user.token;

        // 2. Define a unique title for the target article using Faker
        targetArticleTitle = `Portfolio Search Target - ${faker.string.uuid()}`;

        // 3. Create 11 articles (10 per page in Conduit) to force pagination
        console.log('🌱 Seeding 11 articles via API...');
        for (let i = 1; i <= 11; i++) {
            // The 11th article will have our unique target title
            const title = (i === 11) ? targetArticleTitle : `Seeded Pagination Article ${i} - ${faker.string.nanoid(5)}`;
            
            await request.post(`${API_URL}/articles`, {
                headers: { 'Authorization': `Token ${token}` },
                data: {
                    article: {
                        title: title,
                        description: 'Automated seeding for pagination testing',
                        body: 'This is a test article created to verify dynamic search and pagination logic.',
                        tagList: ['test', 'pagination']
                    }
                }
            });
        }
        console.log(`✅ API Seeding complete. Target article: "${targetArticleTitle}"`);
    });

    test('HOME-03: Verify dynamic pagination by searching for a specific article', async ({ homePage, page }) => {

        // 🏗️ Step 1: Navigate to Home and ensure the feed is loaded
        await homePage.goto();
        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

        let isArticleFound = false;
        let currentPage = 1;
        const maxPagesToSearch = 10;

        // 🏃 Step 2: Dynamically search through pages using a while loop
        // 💡 Skill Highlight: Handling Race Conditions and Dynamic UI Elements
        await test.step(`Search for the unique article across pages`, async () => {
            while (!isArticleFound && currentPage <= maxPagesToSearch) {
                console.log(`🔎 Searching on Page ${currentPage}...`);

                // Wait for the loading indicator to disappear to ensure the list is rendered
                await expect(page.locator('text=Loading articles...')).not.toBeVisible();

                const articleLocator = page.locator('.article-preview h1', { hasText: targetArticleTitle });
                
                if (await articleLocator.isVisible()) {
                    isArticleFound = true;
                    console.log(`✅ Found article on Page ${currentPage}!`);
                    break;
                }

                // If not found, attempt to navigate to the next page
                currentPage++;
                const nextPageLocator = page.locator('.pagination .page-link').getByText(currentPage.toString(), { exact: true });

                try {
                    // Ensure the next page button is visible before clicking
                    await nextPageLocator.waitFor({ state: 'visible', timeout: 3000 });
                    await nextPageLocator.click();

                    // Verification: Ensure the active pagination UI matches the current search page
                    await expect(page.locator('.pagination .page-item.active')).toHaveText(currentPage.toString());
                } catch (e) {
                    console.log(`⚠️ Reached end of pagination at Page ${currentPage - 1} without finding the article.`);
                    break;
                }
            }
        });

        // 👀 Step 3: Final Verification
        await test.step('Verify that the target article was successfully located', async () => {
            if (isArticleFound) {
                const articleLocator = page.locator('.article-preview h1', { hasText: targetArticleTitle });
                await expect(articleLocator).toBeVisible();
                
                // Confirm the pagination state
                const activePageButton = page.locator('.pagination .page-item.active');
                await expect(activePageButton).toHaveText(currentPage.toString());
            } else {
                throw new Error(`❌ Failed to locate article "${targetArticleTitle}" within the searched ${maxPagesToSearch} pages.`);
            }
        });
    });
});
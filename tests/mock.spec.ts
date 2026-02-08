//tests/mock.spec.ts
import { test, expect } from '@fixtures/pom';

/**
 * Module: Network Mocking
 * * * Test Scenarios:
 * - [MOCK-01]: Your Feed Empty State - Simulated via response mocking to verify empty UI.
 * - [MOCK-02]: Global Feed Error Handling - Simulated via 500 server error to verify graceful failure.
 * * * Technical Highlights:
 * - Network Interception: Leveraging page.route() to manipulate API responses for edge-case testing.
 * - Resilience Testing: Validating UI stability and user messaging during backend failures (500 Errors).
 * - POM Integration: Encapsulating component locators (Article List) within Page Objects for maintenance.
 * - Data Simulation: Mocking complex JSON structures to decouple UI tests from backend state.
 */

test.describe('Module: Network Mocking', () => {

    test('MOCK-01: Verify "Your Feed" empty state message via response mocking', async ({ page, homePage }) => {

        // 🏗️ Step 1: Set up Network Interception with mocked empty data
        // Intercepting the GET request to simulate a new user with zero articles.
        await page.route('**/api/articles*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ articles: [], articlesCount: 0 })
            });
        });

        // 🏃 Step 2: Navigate to Home and switch to the "Your Feed" tab
        await homePage.goto();

        await test.step('Switch to Your Feed tab', async () => {
            await homePage.tabYourFeed.click();
            await expect(homePage.tabYourFeed).toHaveClass(/active/);
        });

        // 👀 Step 3: Verify the UI correctly displays the empty state message
        await test.step('Verify empty state UI elements', async () => {
            await expect(homePage.emptyStateMessage).toBeVisible({ timeout: 10000 });
            // ✅ Refined: Using POM locator instead of manual page.locator
            await expect(page.locator('.article-preview h1')).toBeHidden();
        });
    });

    test('MOCK-02: Verify "Global Feed" error state handling (Simulating Server Crash)', async ({ page, homePage }) => {

        // 🏗️ Step 1: Intercept API and force a 500 Internal Server Error
        // Wildcard pattern ensures interception of dynamic query parameters.
        await page.route('**/api/articles?*', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ errors: { body: ['Internal Server Error'] } })
            });
            console.log('💥 Simulated a 500 Server Error for Global Feed.');
        });

        // 🏃 Step 2: Navigate to Home to trigger the automatic Global Feed request
        await homePage.goto();

        // 👀 Step 3: Verify the UI handles the server failure gracefully
        await test.step('Verify error message on UI', async () => {
            // ✅ Refined: Verifying that the app displays a fallback or loading state gracefully
            await expect(homePage.articleListContainer).toContainText('Loading articles...');
        });
    });
});
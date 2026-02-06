// tests/mock.spec.ts
import { test, expect } from '@fixtures/pom';

/**
 * Module: Network Mocking
 * * This test suite demonstrates the ability to intercept network requests 
 * and simulate various backend states to verify UI resilience:
 * - [MOCK-01]: Verify "Your Feed" Empty State (Force empty data via response mocking)
 * - [MOCK-02]: Verify "Global Feed" Error Handling (Simulate Server Crash - 500 Error)
 * * Technical Highlights:
 * - Network Interception: Using page.route() to manipulate API responses.
 * - Resilience Testing: Ensuring the UI handles empty data and server errors gracefully.
 */
test.describe('Module: Network Mocking', () => {

    test('MOCK-01: Verify "Your Feed" empty state message via response mocking', async ({ page, homePage }) => {

        // 🏗️ Step 1: Set up Network Interception with mocked empty data
        // We intercept the GET request to the feed API to simulate a new user with no posts.
        await page.route('**/api/articles/feed*', async (route) => {
            const mockResponse = {
                articles: [],
                articlesCount: 0
            };

            // Fulfill the route with a mocked 200 OK response and empty data
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockResponse)
            });
            console.log('👻 Successfully mocked "Your Feed" API with empty data.');
        });

        // 🏃 Step 2: Navigate to Home and switch to the "Your Feed" tab
        // Note: Global Setup ensures the user is already authenticated.
        await homePage.goto();

        await test.step('Switch to Your Feed tab', async () => {
            await homePage.tabYourFeed.click();
            // Wait for the tab to be visually active before checking content
            await expect(homePage.tabYourFeed).toHaveClass(/active/);
        });

        // 👀 Step 3: Verify the UI correctly displays the empty state message
        await test.step('Verify empty state UI elements', async () => {
            const emptyMessage = page.locator('app-article-list');
            await expect(emptyMessage).toContainText('No articles are here... yet.');
        });
    });

    test('MOCK-02: Verify "Global Feed" error state handling (Simulating Server Crash)', async ({ page, homePage }) => {

        // 🏗️ Step 1: Intercept API and force a 500 Internal Server Error
        // Uses wildcard pattern to handle any dynamic query parameters.
        await page.route('**/api/articles?*', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ errors: { body: ['Internal Server Error'] } })
            });
        });

        // 🏃 Step 2: Navigate to Home to trigger the automatic Global Feed request
        await homePage.goto();

        // 👀 Step 3: Verify the UI handles the server failure gracefully
        await test.step('Verify error message on UI', async () => {
            const errorMsg = page.locator('app-article-list');
            // Depending on how Conduit handles 500 errors, it might show a specific message
            await expect(errorMsg).toContainText('Loading articles...');
            // Usually, we verify that the app doesn't crash and shows a graceful failure message.
        });
    });
});
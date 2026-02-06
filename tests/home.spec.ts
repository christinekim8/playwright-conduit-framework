//tests/home.spec.ts
import { test, expect } from '@fixtures/pom';

/**
 * Module: Home Page (UI & Navigation)
 * * This test suite verifies the Home Page layout and GNB (Global Navigation Bar) for different user states:
 * * * 1. Guest User View:
 * - [HOME-01]: Verify Guest UI Layout (Sign in/up visibility)
 * * * 2. Logged-in User View:
 * - [HOME-04]: Verify User UI Layout (Personalized menus & Feed accessibility)
 * * * Technical Highlights:
 * - State Management: Overriding storageState for Guest context.
 * - Element Visibility: Conditional assertions based on authentication state.
 */

// ---------------------------------------------------------------------------
// Group 1: Guest User
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
// Group 2: Logged-in User
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
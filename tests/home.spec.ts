//tests/home.spec.ts
import { test, expect } from '@fixtures/pom';

// ---------------------------------------------------------------------------
// Group 1: Guest User
// ---------------------------------------------------------------------------
test.describe('Module: Home Page (Guest View)', () => {
    // Ensure clean state (Guest mode) by overriding storageState for this group
    test.use({ storageState: { cookies: [], origins: [] } });

    test('HOME-01: Verify Guest UI Layout', async ({ homePage }) => {

        await homePage.goto();

        // 1. Initial Check
        await expect(homePage.brandLogo).toHaveText('conduit');
        await expect(homePage.navHome).toBeVisible();

        // 2. Guest-specific Elements Check
        await expect(homePage.navSignIn).toBeVisible();
        await expect(homePage.navSignUp).toBeVisible();

        // 3. Main Feed Check
        // Expect 'Global Feed' to be active by default for guests.
        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

        // 'Your Feed' acts as a gatekeeper for guests (visible but redirects to login).
        // Redirection logic is covered in AUTH-15.
        await expect(homePage.tabYourFeed).toBeVisible();

        // 4. Popular Tags Check
        await expect(homePage.popularTagsSection).toContainText('Popular Tags');
    });
});

// ---------------------------------------------------------------------------
// Group 2: Logged-in User
// ---------------------------------------------------------------------------
test.describe('Module: Home Page (Logged-in View)', () => {

    // Uses global authenticated state injected via global-setup
    test('HOME-04: Verify User UI Layout (Personalized)', async ({ homePage }) => {

        await homePage.goto();

        // 1. Initial Check
        await expect(homePage.brandLogo).toHaveText('conduit');
        await expect(homePage.navHome).toBeVisible();

        // 2. User-specific Elements Check
        await expect(homePage.navSignIn).not.toBeVisible();
        await expect(homePage.navSignUp).not.toBeVisible();
        await expect(homePage.navNewArticle).toBeVisible();
        await expect(homePage.navSettings).toBeVisible();
        await expect(homePage.navUsername).toBeVisible();

        // 3. Main Feed Check (updated)
        // Even for logged-in users, the application defaults to 'Global Feed'.
        await expect(homePage.tabGlobalFeed).toHaveClass(/active/);

        // 'Your Feed' is available but inactive.
        await expect(homePage.tabYourFeed).toBeVisible();
    });
});
import { test as base } from '@playwright/test';
import { HomePage } from '@pages/home.page';
import { LoginPage } from '@pages/login.page';
import { EditorPage } from '@pages/editor.page';
import { SettingsPage } from '@pages/settings.page';

// 1. Declare Types
type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  editorPage: EditorPage;
  settingsPage: SettingsPage;
};

// 2. Extend Test with Fixtures
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});

export { expect } from '@playwright/test';
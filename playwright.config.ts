import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
//API URL
export const API_URL = 'https://conduit-api.bondaracademy.com/api';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  
  // Run this file before tests start (fetch login token)
  globalSetup: require.resolve('./src/utils/global-setup'),

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  use: {
    /* Base URL */
    baseURL: 'https://conduit.bondaracademy.com',
    // Inject the login state (state.json) created by global setup
    storageState: 'state.json',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome']
      }
    },
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox']
    //   }
    // },
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari']
    //   }
    // }
  ]
});
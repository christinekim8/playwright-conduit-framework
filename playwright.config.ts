import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

export default defineConfig({
  testDir: './tests',  
  /* Run tests in files in parallel */
  fullyParallel: true,  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,  
  /* Retry on CI only */
  // Strategy: Retrying twice on CI helps mitigate flaky network issues, 
  // while zero retries locally allows for faster feedback loops during debugging.
  retries: process.env.CI ? 2 : 0,  
  /* Opt out of parallel tests on CI. */
  // Strategy: Limiting workers to 1 on CI ensures resource stability 
  // and prevents false negatives caused by resource contention (CPU/Memory).
  workers: process.env.CI ? 1 : undefined,  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // Prints results to console
    ['html'], // Generates a static HTML report
    ['allure-playwright', { outputFolder: 'allure-results' }]  
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://conduit.bondaracademy.com',
    // It keeps the execution fast for passing tests but captures full debugging context (snapshots, console logs, network) when a test fails and retries.
    trace: 'on-first-retry',
    /* Capture screenshot only on failure to save storage space in CI artifacts */
    screenshot: 'only-on-failure',
    /* Retain video only on failure for visual debugging context */
    video: 'retain-on-failure',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome']
        // Inject the authenticated state (token) into the browser context
      }
    },
/* You can uncomment these if you want to test cross-browser compatibility */
// {
//   name: 'firefox',
//   use: { 
//     ...devices['Desktop Firefox']
//  }
//  },
// {
//   name: 'webkit',
//   use: { 
// ...devices['Desktop Safari']
// }
//  }
  ]
});
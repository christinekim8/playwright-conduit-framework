//src/utils/global-setup.ts
import { request, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global Setup Utility
 * Purpose: Performs API-based authentication before the test suite starts.
 * Benefit: Saves the authenticated state (JWT) into '.auth/state.json' to bypass UI login for all tests, significantly reducing execution time.
 */
async function globalSetup(config: FullConfig) {
    const { baseURL, storageState } = config.projects[0].use;

    // Use environment variables for security.
    const userEmail = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    if (!userEmail || !password) {
        throw new Error('USER_EMAIL and USER_PASSWORD must be configured');
    }

    console.log('🔵 Global Setup: Trying to auth via API.');

    const requestContext = await request.newContext();

    // 1. Send API login request
    // [Ref] API Spec: https://realworld-docs.netlify.app/specifications/backend/endpoints/
    const response = await requestContext.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: {
                email: userEmail,
                password: password,
            },
        },
    });

    // 2. Verify response status
    // Fail fast if login fails (e.g., 401 Unauthorized).
    if (!response.ok()) {
        throw new Error(`❌ Login Failed! Please check your email/password. Status: ${response.status()}`);
    }

    // 3. Extract the Access Token from response
    const responseJson = await response.json();
    const accessToken = responseJson.user.token;

    // 4. Construct storage state
    // Inject the token into localStorage to bypass the UI login process for subsequent tests.
    // (Conduit app uses 'jwtToken' key for authentication) 
    const state = {
        cookies: [],
        origins: [
            {
                origin: baseURL as string,
                localStorage: [
                    {
                        name: 'jwtToken',
                        value: accessToken,
                    },
                ],
            },
        ],
    };

    // 5. Save state to file
    // This file will be reused by all tests defined in playwright.config.ts to set the authenticated state.
    const storageStatePath = storageState as string;
    fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });
    fs.writeFileSync(storageStatePath, JSON.stringify(state));

    console.log('✅ Global Setup completed: Login successful and storage state saved.');
}

export default globalSetup;
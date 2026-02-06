//src/utils/global-setup.ts
import { request, FullConfig } from '@playwright/test';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
    const { baseURL, storageState } = config.projects[0].use;

    // Use environment variables for security, but provide fallback credentials for easier local execution.
    const userEmail = process.env.USER_EMAIL || 'username10@gmail.com';
    const password = process.env.USER_PASSWORD || 'username10';

    console.log(`🔵 Global Setup: Trying to auth via API (UserEmail: ${userEmail})`);

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
    fs.writeFileSync(storageState as string, JSON.stringify(state));

    console.log('✅ Global Setup completed: Login successful and state.json saved.');
}

export default globalSetup;
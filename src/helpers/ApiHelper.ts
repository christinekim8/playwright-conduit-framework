//src/helpers/ApiHelper.ts
import { APIRequestContext } from '@playwright/test';
import { API_URL } from '../../playwright.config';
import { faker } from '@faker-js/faker';

type LoginResponse = {
    user: {
        token: string;
    };
};

type CreateArticleResponse = {
    article: {
        slug: string;
    };
};

function isLoginResponse(value: unknown): value is LoginResponse {
    if (typeof value !== 'object' || value === null || !('user' in value)) {
        return false;
    }

    const user = value.user;
    return typeof user === 'object'
        && user !== null
        && 'token' in user
        && typeof user.token === 'string';
}

function isCreateArticleResponse(value: unknown): value is CreateArticleResponse {
    if (typeof value !== 'object' || value === null || !('article' in value)) {
        return false;
    }

    const article = value.article;
    return typeof article === 'object'
        && article !== null
        && 'slug' in article
        && typeof article.slug === 'string';
}

export class ApiHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * @description Authenticates the user and returns the authorization token.
     */
    async login(email?: string, password?: string): Promise<string> {
        const loginEmail = email ?? process.env.USER_EMAIL;
        const loginPassword = password ?? process.env.USER_PASSWORD;

        if (!loginEmail || !loginPassword) {
            throw new Error('Missing USER_EMAIL / USER_PASSWORD. Set them in GitHub Actions secrets or a local environment.');
        }

        const response = await this.request.post(`${API_URL}/users/login`, {
            data: {
                user: { email: loginEmail, password: loginPassword }
            }
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`🚨 API Login Failed! Status: ${response.status()} \nBody: ${body}`);
        }

        const responseBody: unknown = await response.json();
        if (!isLoginResponse(responseBody)) {
            throw new Error('API Login Failed! Response did not contain a valid user token.');
        }

        return responseBody.user.token;
    }

    /**
     * @description Seeds a new article and returns its slug for testing.
     */
    async createArticle(
        token: string,
        data: { title: string; description: string; body: string; tags?: string[] }
    ): Promise<string> {
        const response = await this.request.post(`${API_URL}/articles`, {
            headers: { 'Authorization': `Token ${token}` },
            data: {
                article: {
                    title: data.title,
                    description: data.description,
                    body: data.body,
                    tagList: data.tags || ['test']
                }
            }
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`Failed to create article. Status: ${response.status()}. Body: ${body}`);
        }

        const body: unknown = await response.json();
        if (!isCreateArticleResponse(body)) {
            throw new Error('Failed to create article. Response did not contain a valid article slug.');
        }

        return body.article.slug;
    }

    /**
     * @description Deletes an article using its slug. (Cleanup)
     */
    async deleteArticle(token: string, slug: string): Promise<number> {
        const response = await this.request.delete(`${API_URL}/articles/${slug}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (response.status() === 404) {
            return response.status();
        }

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(
                `Failed to delete article "${slug}". Status: ${response.status()}. Body: ${body}`
            );
        }

        return response.status();
    }

    /**
     * @description Seeds multiple articles for testing purposes.
     */
    async seedArticles(
        token: string,
        count: number,
        targetTitle: string,
        tags: string[] = ['test']
    ): Promise<string[]> {
        console.log(`🌱 Seeding ${count} articles via API...`);

        const promises = Array.from({ length: count }).map((_, i) => {
            // Use targetTitle for the last article, generate random titles for others.
            const title = (i === count - 1) ? targetTitle : `Seeded Article ${i + 1} - ${faker.string.nanoid(5)}`;

            return this.createArticle(token, {
                title: title,
                description: 'Automated seeding for testing',
                body: 'This is a test article content for search and pagination.',
                tags: tags
            });
        });

        const slugs = await Promise.all(promises);

        console.log(`✅ Successfully seeded ${slugs.length} articles.`);
        return slugs;
    }

    /**
     * @description Cleans up multiple articles given their slugs.
     */
    async cleanupArticles(token: string, slugs: string[]): Promise<void> {
        console.log(`🧹 Starting cleanup for ${slugs.length} articles...`);
        for (const slug of slugs) {
            await this.deleteArticle(token, slug);
        }
        console.log(`✅ Cleanup Articles completed.`);
    }
}
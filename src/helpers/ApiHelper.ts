//src/helpers/ApiHelper.ts
import { APIRequestContext } from '@playwright/test';
import { API_URL } from '../../playwright.config';
import { faker } from '@faker-js/faker';

export class ApiHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * @description Authenticates the user and returns the authorization token.
     */
    async login(email: string = process.env.USER_EMAIL || 'username10@gmail.com',
        password: string = process.env.USER_PASSWORD || 'username10'
    ) {
        const response = await this.request.post(`${API_URL}/users/login`, {
            data: {
                user: { email, password }
            }
        });

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`🚨 API Login Failed! Status: ${response.status()} \nBody: ${body}`);
        }

        const responseBody = await response.json();
        return responseBody.user.token;
    }

    /**
     * @description Seeds a new article and returns its slug for testing.
     */
    async createArticle(token: string, data: { title: string, description: string, body: string, tags?: string[] }) {
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

        if (!response.ok()) throw new Error('🚨 Failed to create article');

        const body = await response.json();
        return body.article.slug;
    }

    /**
     * @description Deletes an article using its slug. (Cleanup)
     */
    async deleteArticle(token: string, slug: string) {
        const response = await this.request.delete(`${API_URL}/articles/${slug}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok() && response.status() !== 404) {
            console.error(`⚠️ API Cleanup Failed for slug: ${slug}`);
        }
        return response.status();
    }

    /**
     * @description Seeds multiple articles for testing purposes.
     */
    async seedArticles(token: string, count: number, targetTitle: string, tags: string[] = ['test']) {
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
    async cleanupArticles(token: string, slugs: string[]) {
        console.log(`🧹 Starting cleanup for ${slugs.length} articles...`);
        for (const slug of slugs) {
            await this.deleteArticle(token, slug);
        }
        console.log(`✅ Cleanup Articles completed.`);
    }
}
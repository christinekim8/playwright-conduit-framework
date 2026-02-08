//src/pages/article.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object Model for the Article Detail View.
 * Handles article content visualization, management actions (Edit/Delete), 
 * and full lifecycle of comment interactions.
 */
export class ArticlePage extends BasePage {
    // 1. Hero Banner Section (Metadata & Primary Actions)
    readonly articleTitle: Locator;
    readonly articleAuthor: Locator;
    readonly dateLabel: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;

    // 2. Article Content Section
    readonly articleBody: Locator;
    readonly articleTags: Locator;

    // 3. Comment Section Locators
    readonly commentForm: Locator;
    readonly commentInput: Locator;
    readonly postCommentBtn: Locator;
    readonly commentCards: Locator;

    constructor(page: Page) {
        super(page);

        // Hero Banner Section
        this.articleTitle = page.locator('.banner h1');
        this.articleAuthor = page.locator('.banner .author');
        this.dateLabel = page.locator('.banner .date');
        this.editButton = page.locator('.banner').getByRole('link', { name: 'Edit Article' });
        this.deleteButton = page.locator('.banner').getByRole('button', { name: 'Delete Article' });

        // Article Content Section
        this.articleBody = page.locator('.article-content');
        this.articleTags = page.locator('.tag-list');

        // Comment Section
        this.commentForm = page.locator('form.comment-form');
        this.commentInput = page.getByPlaceholder('Write a comment...');
        this.postCommentBtn = page.locator('button', { hasText: 'Post Comment' });
        this.commentCards = page.locator('app-article-comment');
    }

    // --- Actions ---

    /**
     * Posts a new comment and waits for it to be visible in the UI.
     * @param text - The content of the comment to post.
     */
    async addComment(text: string) {
        await this.commentInput.fill(text);
        await this.postCommentBtn.click();

        // Wait for the specific comment to appear to prevent race conditions
        await this.commentCards.filter({ hasText: text }).waitFor({ state: 'visible' });
    }

    /**
     * Deletes a specific comment identified by its text content.
     * @param commentText - The exact text of the comment to delete.
     */
    async deleteComment(commentText: string) {
        const targetCard = this.commentCards.filter({ hasText: commentText });
        await targetCard.locator('.mod-options .ion-trash-a').click();

        // Ensure the comment is removed from the DOM
        await targetCard.waitFor({ state: 'hidden' });
    }

    /**
     * Checks if a specific comment is currently visible on the page.
     * @param commentText - The text of the comment to check.
     * @returns Promise<boolean>
     */
    async isCommentVisible(commentText: string): Promise<boolean> {
        const comment = this.commentCards.filter({ hasText: commentText });
        return await comment.isVisible();
    }

    /**
 * Returns a locator for a specific comment card based on its text content.
 * @param text - The content of the comment to find.
 */
    getCommentLocator(text: string) {
        return this.commentCards.filter({ hasText: text });
    }
}
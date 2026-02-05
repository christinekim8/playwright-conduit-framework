import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

//Page Object Model for the Article Detail View.
export class ArticlePage extends BasePage {
    readonly articleTitle: Locator;
    readonly articleAuthor: Locator;
    readonly dateLabel: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly articleBody: Locator;
    readonly articleTags: Locator;
    readonly commentForm: Locator;
    readonly postCommentBtn: Locator;

    constructor(page: Page) {
        super(page);
        // 1. Hero Banner Section (Title, Author, Metadata, Actions)
        this.articleTitle = page.locator('.banner h1');
        this.articleAuthor = page.locator('.banner .author');
        this.dateLabel = page.locator('.banner .date');
        this.editButton = page.locator('.banner').getByRole('link', { name: 'Edit Article' });
        this.deleteButton = page.locator('.banner').getByRole('button', { name: 'Delete Article' });

        // 2. Article Content Section (Body & Tags)
        this.articleBody = page.locator('.article-content');
        this.articleTags = page.locator('.tag-list');

        // 3. Comment Section
        this.commentForm = page.locator('form.comment-form');
        this.postCommentBtn = page.locator('button', { hasText: 'Post Comment' });
    }
}
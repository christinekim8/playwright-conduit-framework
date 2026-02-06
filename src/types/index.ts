//src/types/index.ts
/**
 * Represents the User object returned by the Conduit API.
 */
export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
}

/**
 * Payload structure for creating a new article.
 */
export interface ArticlePayload {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

/**
 * Response structure for a single article.
 */
export interface ArticleResponse {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}
/**
 * Transformed Individual Blog Post DTO
 * (Excludes: status, folder_image_banner, folder_link, updated_at, created_at)
 */
export interface BlogPostDTO {
    id: number;
    title: string;
    slug: string;
    theme: 'Arcadeluz' | 'World' | 'Gaming';
    location: string | null;
    header_image: string | null;
    body: string; // HTML content
    published_at: string; // ISO Date string (e.g., "2023-10-27T10:00:00.000000Z")
}

/**
 * Laravel Pagination object containing the transformed data
 */
export interface PaginatedBlogData {
    current_page: number;
    data: BlogPostDTO[]; // The filtered array of posts
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

/**
 * Root response from the /luna/blog endpoint
 */
export interface BlogApiResponse {
    error: number; // 0 for success
    message: string;
    data: PaginatedBlogData;
}

/**
 * Root response from the /luna/blog/{id} endpoint
 */
export interface SingleBlogPostResponse {
    error: number; // 0 for success
    message: string;
    data: SingleBlogPostDTO;
}

/**
 * Single Blog Post DTO
 * Contains all BlogPost model fields EXCEPT the 'id'
 */
export interface SingleBlogPostDTO {
    title: string;
    slug: string;
    theme: 'Arcadeluz' | 'World' | 'Gaming';
    location: string | null;
    header_image: string | null;
    body: string; // HTML content
    status: 'published' | 'draft';
    published_at: string; // ISO Date string (e.g., "2023-10-27T10:00:00.000000Z")
    created_at: string;
    updated_at: string;
    folder_image_banner: string[]; // Casted from JSON in the database
    folder_link: string[];         // Casted from JSON in the database
}

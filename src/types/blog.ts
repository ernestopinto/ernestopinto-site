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

/**
 * Individual Blog Post DTO
 */
export interface BlogPostDTO {
    id: number;
    title: string;
    slug: string;
    theme: 'Arcadeluz' | 'World' | 'Gaming';
    location: string | null;
    header_image: string | null;
    body: string; // HTML content
    status: 'published' | 'draft';
    published_at: string; // ISO Date string
    created_at: string;
    updated_at: string;
    // JSON casted arrays
    folder_image_banner: string[]; 
    folder_link: string[];
}

/**
 * Laravel Pagination object
 */
export interface PaginatedBlogData {
    current_page: number;
    data: BlogPostDTO[]; // The actual array of posts
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
